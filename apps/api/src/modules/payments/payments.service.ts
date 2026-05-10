import { createHmac, randomUUID, timingSafeEqual } from 'crypto';

import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { CreatePaymentDto } from './dto/create-payment.dto';
import { ListPaymentsDto } from './dto/list-payments.dto';
import { PaymentActionDto } from './dto/payment-action.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { MoyasarClient } from './moyasar.client';
import { PaymentsRepository } from './payments.repository';
import { PaymentInitiatorRole, PaymentStatus, User, UserRole } from '../../generated/client';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);

  constructor(
    private readonly paymentsRepository: PaymentsRepository,
    private readonly moyasar: MoyasarClient,
    private readonly config: ConfigService,
  ) {}

  async createPayment(dto: CreatePaymentDto, user: User, idempotencyKey?: string) {
    const key = idempotencyKey ?? randomUUID();
    const existing = await this.paymentsRepository.findByIdempotencyKey(key);
    if (existing) return this.clean(existing);

    const payment = await this.paymentsRepository.create({
      payerUserId: user.id,
      initiatorRole: this.mapInitiatorRole(user.role),
      studentUserId: dto.studentUserId,
      courseId: dto.courseId,
      orderId: dto.orderId,
      amount: dto.amount,
      currency: dto.currency.toUpperCase(),
      idempotencyKey: key,
      metadata: {
        ...(dto.metadata ?? {}),
        order_id: dto.orderId,
        local_payment_id: key,
      },
    });

    const response = await this.moyasar.createPayment(
      {
        amount: dto.amount,
        currency: dto.currency.toUpperCase(),
        description: dto.description ?? `Order ${dto.orderId}`,
        callback_url: dto.callbackUrl,
        source: dto.source,
        metadata: {
          ...(dto.metadata ?? {}),
          order_id: dto.orderId,
          local_payment_id: payment.id,
        },
      },
      { idempotencyKey: key },
    );

    const synced = await this.paymentsRepository.updateGatewayState(payment.id, {
      moyasarPaymentId: this.stringValue(response.id),
      moyasarStatus: this.stringValue(response.status),
      status: this.mapStatus(this.stringValue(response.status)),
      amount: this.numberValue(response.amount, dto.amount),
      currency: this.stringValue(response.currency) ?? dto.currency.toUpperCase(),
      refundedAmount: this.numberValue(response.refunded, 0),
      capturedAmount: this.numberValue(response.captured, 0),
      metadata: response.metadata ?? dto.metadata ?? null,
      rawGatewayResponse: response,
    });

    this.logger.log(`Created Moyasar payment ${synced.moyasarPaymentId} for order ${dto.orderId}`);
    return this.clean(synced);
  }

  async fetchPayment(id: string) {
    const local = await this.getLocalPayment(id);
    if (!local.moyasarPaymentId) return this.clean(local);

    const response = await this.moyasar.fetchPayment(local.moyasarPaymentId);
    const synced = await this.paymentsRepository.updateGatewayState(local.id, {
      moyasarPaymentId: this.stringValue(response.id),
      moyasarStatus: this.stringValue(response.status),
      status: this.mapStatus(this.stringValue(response.status)),
      amount: this.numberValue(response.amount, local.amount),
      currency: this.stringValue(response.currency) ?? local.currency,
      refundedAmount: this.numberValue(response.refunded, local.refundedAmount),
      capturedAmount: this.numberValue(response.captured, local.capturedAmount),
      metadata: response.metadata ?? local.metadata,
      rawGatewayResponse: response,
    });

    return this.clean(synced);
  }

  async listPayments(query: ListPaymentsDto) {
    const [items, total] = await Promise.all([
      this.paymentsRepository.list(query),
      this.paymentsRepository.count(query),
    ]);

    return {
      total,
      limit: query.limit,
      offset: query.offset,
      items: items.map((payment) => this.clean(payment)),
    };
  }

  async updatePayment(id: string, dto: UpdatePaymentDto) {
    const local = await this.getLocalPayment(id);

    let gatewayResponse: Record<string, unknown> | undefined;
    if (local.moyasarPaymentId && (dto.metadata || dto.description)) {
      gatewayResponse = await this.moyasar.updatePayment(local.moyasarPaymentId, {
        metadata: dto.metadata,
        description: dto.description,
      });
    }

    const updated = await this.paymentsRepository.updateGatewayState(local.id, {
      status: dto.status ?? this.mapStatus(this.stringValue(gatewayResponse?.status)),
      moyasarStatus: this.stringValue(gatewayResponse?.status) ?? local.moyasarStatus ?? undefined,
      metadata: gatewayResponse?.metadata ?? dto.metadata ?? local.metadata,
      rawGatewayResponse: gatewayResponse ?? local.rawGatewayResponse,
    });

    return this.clean(updated);
  }

  async refundPayment(id: string, dto: PaymentActionDto, user: User, idempotencyKey?: string) {
    const local = await this.requireGatewayPayment(id);
    const response = await this.moyasar.refundPayment(
      local.moyasarPaymentId,
      this.optionalAmountPayload(dto),
      { idempotencyKey: idempotencyKey ?? `refund-${local.id}-${dto.amount ?? 'full'}` },
    );

    await this.createRefundRecord(local.id, dto, user);
    return this.syncOperation(local.id, response);
  }

  async capturePayment(id: string, dto: PaymentActionDto, idempotencyKey?: string) {
    const local = await this.requireGatewayPayment(id);
    const response = await this.moyasar.capturePayment(
      local.moyasarPaymentId,
      this.optionalAmountPayload(dto),
      { idempotencyKey: idempotencyKey ?? `capture-${local.id}-${dto.amount ?? 'full'}` },
    );
    return this.syncOperation(local.id, response);
  }

  async voidPayment(id: string, idempotencyKey?: string) {
    const local = await this.requireGatewayPayment(id);
    const response = await this.moyasar.voidPayment(local.moyasarPaymentId, {
      idempotencyKey: idempotencyKey ?? `void-${local.id}`,
    });
    return this.syncOperation(local.id, response);
  }

  listWebhookEvents(limit?: number) {
    return this.paymentsRepository.listWebhookEvents(limit);
  }

  async handleWebhook(
    payload: unknown,
    headers: Record<string, string | string[] | undefined>,
    rawBody?: Buffer,
  ) {
    this.verifyWebhook(headers, rawBody, payload);

    const body = this.asRecord(payload);
    const paymentPayload = this.extractPaymentPayload(body);
    const moyasarPaymentId = this.stringValue(paymentPayload.id);
    const eventId = this.stringValue(body.id);
    const eventType =
      this.stringValue(body.type) ??
      this.stringValue(body.event) ??
      `payment.${this.stringValue(paymentPayload.status) ?? 'updated'}`;

    const local = moyasarPaymentId
      ? await this.paymentsRepository.findByMoyasarPaymentId(moyasarPaymentId)
      : null;

    await this.paymentsRepository.recordWebhookEvent({
      eventId,
      eventType,
      moyasarPaymentId,
      paymentId: local?.id,
      payload,
    });

    if (!local) {
      this.logger.warn(
        `Webhook received for unknown Moyasar payment ${moyasarPaymentId ?? 'unknown'}`,
      );
      return { received: true, synced: false };
    }

    await this.paymentsRepository.updateGatewayState(local.id, {
      moyasarPaymentId,
      moyasarStatus: this.stringValue(paymentPayload.status),
      status: this.mapStatus(this.stringValue(paymentPayload.status)),
      amount: this.numberValue(paymentPayload.amount, local.amount),
      currency: this.stringValue(paymentPayload.currency) ?? local.currency,
      refundedAmount: this.numberValue(paymentPayload.refunded, local.refundedAmount),
      capturedAmount: this.numberValue(paymentPayload.captured, local.capturedAmount),
      metadata: paymentPayload.metadata ?? local.metadata,
      rawGatewayResponse: paymentPayload,
    });

    return { received: true, synced: true };
  }

  private async getLocalPayment(id: string) {
    const payment = await this.paymentsRepository.findById(id);
    if (!payment) throw new NotFoundException('PAYMENT_NOT_FOUND');
    return payment;
  }

  private async requireGatewayPayment(id: string) {
    const payment = await this.getLocalPayment(id);
    if (!payment.moyasarPaymentId) throw new BadRequestException('PAYMENT_NOT_SYNCED_WITH_MOYASAR');
    return { ...payment, moyasarPaymentId: payment.moyasarPaymentId };
  }

  private async syncOperation(localPaymentId: string, response: Record<string, unknown>) {
    const updated = await this.paymentsRepository.updateGatewayState(localPaymentId, {
      moyasarPaymentId: this.stringValue(response.id),
      moyasarStatus: this.stringValue(response.status),
      status: this.mapStatus(this.stringValue(response.status)),
      amount: this.numberValue(response.amount, undefined),
      currency: this.stringValue(response.currency),
      refundedAmount: this.numberValue(response.refunded, undefined),
      capturedAmount: this.numberValue(response.captured, undefined),
      metadata: response.metadata ?? null,
      rawGatewayResponse: response,
    });
    return this.clean(updated);
  }

  private async createRefundRecord(paymentId: string, dto: PaymentActionDto, user: User) {
    await this.paymentsRepository.createProcessedRefund({
      paymentId,
      requestedBy: user.id,
      amount: dto.amount ?? 0,
      currency: 'SAR',
      reason: dto.reason,
    });
  }

  private verifyWebhook(
    headers: Record<string, string | string[] | undefined>,
    rawBody: Buffer | undefined,
    payload: unknown,
  ) {
    const webhookSecret = this.config.get<string>('MOYASAR_WEBHOOK_SECRET');
    if (!webhookSecret) return;

    const signatureHeader = headers['x-moyasar-signature'] ?? headers['moyasar-signature'];
    const signature = Array.isArray(signatureHeader) ? signatureHeader[0] : signatureHeader;
    if (!signature) throw new UnauthorizedException('WEBHOOK_SIGNATURE_MISSING');

    const body = rawBody ?? Buffer.from(JSON.stringify(payload));
    const expected = createHmac('sha256', webhookSecret).update(body).digest('hex');
    const received = signature.replace(/^sha256=/, '');

    if (
      expected.length !== received.length ||
      !timingSafeEqual(Buffer.from(expected), Buffer.from(received))
    ) {
      throw new UnauthorizedException('WEBHOOK_SIGNATURE_INVALID');
    }
  }

  private extractPaymentPayload(body: Record<string, unknown>) {
    const data = this.asRecord(body.data);
    if (data.id || data.status) return data;
    return body;
  }

  private optionalAmountPayload(dto: PaymentActionDto) {
    return dto.amount ? { amount: dto.amount } : {};
  }

  private mapStatus(status?: string | null): PaymentStatus | undefined {
    switch (status) {
      case 'paid':
        return PaymentStatus.paid;
      case 'authorized':
        return PaymentStatus.authorized;
      case 'captured':
        return PaymentStatus.captured;
      case 'refunded':
        return PaymentStatus.refunded;
      case 'failed':
        return PaymentStatus.failed;
      case 'voided':
        return PaymentStatus.voided;
      case 'verified':
        return PaymentStatus.paid;
      case 'initiated':
        return PaymentStatus.initiated;
      default:
        return undefined;
    }
  }

  private mapInitiatorRole(role: UserRole): PaymentInitiatorRole {
    if (role === UserRole.PARENT) return PaymentInitiatorRole.PARENT;
    if (role === UserRole.SUPER_ADMIN) return PaymentInitiatorRole.ADMIN;
    if (role === UserRole.ASSISTANT_ADMIN) return PaymentInitiatorRole.ASSISTANT_ADMIN;
    return PaymentInitiatorRole.STUDENT;
  }

  private clean(payment: {
    id: string;
    orderId: string;
    moyasarPaymentId: string | null;
    amount: number;
    currency: string;
    status: PaymentStatus;
    refundedAmount: number;
    capturedAmount: number;
    metadata: unknown;
    rawGatewayResponse: unknown;
    createdAt: Date;
    updatedAt: Date;
    webhookEvents?: unknown;
  }) {
    return {
      id: payment.id,
      orderId: payment.orderId,
      moyasarPaymentId: payment.moyasarPaymentId,
      amount: payment.amount,
      currency: payment.currency,
      status: payment.status,
      refundedAmount: payment.refundedAmount,
      capturedAmount: payment.capturedAmount,
      metadata: payment.metadata,
      rawGatewayResponse: payment.rawGatewayResponse,
      webhookEvents: payment.webhookEvents,
      createdAt: payment.createdAt,
      updatedAt: payment.updatedAt,
    };
  }

  private numberValue(value: unknown, fallback: number | undefined): number | undefined {
    return typeof value === 'number' ? value : fallback;
  }

  private stringValue(value: unknown): string | undefined {
    return typeof value === 'string' ? value : undefined;
  }

  private asRecord(value: unknown): Record<string, unknown> {
    return value && typeof value === 'object' && !Array.isArray(value)
      ? (value as Record<string, unknown>)
      : {};
  }
}
