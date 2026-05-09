import { Injectable } from '@nestjs/common';

import { ListPaymentsDto } from './dto/list-payments.dto';
import { PaymentStatus, Prisma, RefundMethod, RefundStatus } from '../../generated/client';
import { PrismaService } from '../../prisma/prisma.service';

type CreatePaymentRecord = {
  payerUserId: string;
  initiatorRole: 'STUDENT' | 'PARENT' | 'ADMIN' | 'ASSISTANT_ADMIN';
  studentUserId: string;
  courseId: string;
  orderId: string;
  amount: number;
  currency: string;
  idempotencyKey: string;
  metadata?: Record<string, string>;
};

type GatewaySync = {
  moyasarPaymentId?: string;
  moyasarStatus?: string;
  status?: PaymentStatus;
  amount?: number;
  currency?: string;
  refundedAmount?: number;
  capturedAmount?: number;
  metadata?: unknown;
  rawGatewayResponse?: unknown;
};

@Injectable()
export class PaymentsRepository {
  constructor(private readonly prisma: PrismaService) {}

  findById(id: string) {
    return this.prisma.payment.findUnique({
      where: { id },
      include: { webhookEvents: { orderBy: { processedAt: 'desc' }, take: 20 } },
    });
  }

  findByMoyasarPaymentId(moyasarPaymentId: string) {
    return this.prisma.payment.findUnique({
      where: { moyasarPaymentId },
      include: { webhookEvents: { orderBy: { processedAt: 'desc' }, take: 20 } },
    });
  }

  findByIdempotencyKey(idempotencyKey: string) {
    return this.prisma.payment.findUnique({
      where: { idempotencyKey },
      include: { webhookEvents: { orderBy: { processedAt: 'desc' }, take: 20 } },
    });
  }

  list(query: ListPaymentsDto) {
    return this.prisma.payment.findMany({
      where: {
        status: query.status,
        orderId: query.orderId,
      },
      orderBy: { createdAt: 'desc' },
      skip: query.offset,
      take: query.limit,
      include: { webhookEvents: { orderBy: { processedAt: 'desc' }, take: 5 } },
    });
  }

  count(query: ListPaymentsDto) {
    return this.prisma.payment.count({
      where: {
        status: query.status,
        orderId: query.orderId,
      },
    });
  }

  create(data: CreatePaymentRecord) {
    const decimalAmount = new Prisma.Decimal(data.amount).div(100);

    return this.prisma.payment.create({
      data: {
        payerUserId: data.payerUserId,
        initiatorRole: data.initiatorRole,
        studentUserId: data.studentUserId,
        courseId: data.courseId,
        orderId: data.orderId,
        amount: data.amount,
        originalAmount: decimalAmount,
        finalAmount: decimalAmount,
        discountAmount: new Prisma.Decimal(0),
        currency: data.currency,
        status: PaymentStatus.initiated,
        idempotencyKey: data.idempotencyKey,
        metadata: data.metadata ?? Prisma.JsonNull,
      },
      include: { webhookEvents: true },
    });
  }

  updateGatewayState(paymentId: string, gateway: GatewaySync) {
    return this.prisma.payment.update({
      where: { id: paymentId },
      data: this.gatewayUpdateData(gateway),
      include: { webhookEvents: { orderBy: { processedAt: 'desc' }, take: 20 } },
    });
  }

  updateLocal(
    paymentId: string,
    data: { status?: PaymentStatus; metadata?: Record<string, string> },
  ) {
    return this.prisma.payment.update({
      where: { id: paymentId },
      data: {
        status: data.status,
        metadata: data.metadata ?? undefined,
      },
      include: { webhookEvents: { orderBy: { processedAt: 'desc' }, take: 20 } },
    });
  }

  async recordWebhookEvent(params: {
    eventId?: string;
    eventType: string;
    moyasarPaymentId?: string;
    paymentId?: string;
    payload: unknown;
  }) {
    if (params.eventId) {
      const existing = await this.prisma.paymentWebhookEvent.findUnique({
        where: { eventId: params.eventId },
      });
      if (existing) return existing;
    }

    return this.prisma.paymentWebhookEvent.create({
      data: {
        eventId: params.eventId,
        eventType: params.eventType,
        moyasarPaymentId: params.moyasarPaymentId,
        paymentId: params.paymentId,
        payload: params.payload as Prisma.InputJsonValue,
      },
    });
  }

  listWebhookEvents(limit = 50) {
    return this.prisma.paymentWebhookEvent.findMany({
      orderBy: { processedAt: 'desc' },
      take: limit,
    });
  }

  createProcessedRefund(data: {
    paymentId: string;
    requestedBy: string;
    amount: number;
    currency: string;
    reason?: string;
  }) {
    return this.prisma.refund.create({
      data: {
        paymentId: data.paymentId,
        requestedBy: data.requestedBy,
        refundAmount: new Prisma.Decimal(data.amount).div(100),
        currency: data.currency,
        reason: data.reason,
        method: RefundMethod.ONLINE,
        status: RefundStatus.PROCESSED,
        processedAt: new Date(),
      },
    });
  }

  private gatewayUpdateData(gateway: GatewaySync): Prisma.PaymentUpdateInput {
    const status = gateway.status;

    return {
      moyasarPaymentId: gateway.moyasarPaymentId,
      moyasarStatus: gateway.moyasarStatus,
      status,
      amount: gateway.amount,
      currency: gateway.currency,
      refundedAmount: gateway.refundedAmount,
      capturedAmount: gateway.capturedAmount,
      metadata:
        gateway.metadata === undefined ? undefined : (gateway.metadata as Prisma.InputJsonValue),
      rawGatewayResponse:
        gateway.rawGatewayResponse === undefined
          ? undefined
          : (gateway.rawGatewayResponse as Prisma.InputJsonValue),
      paidAt:
        status === PaymentStatus.paid || status === PaymentStatus.captured ? new Date() : undefined,
      failedAt: status === PaymentStatus.failed ? new Date() : undefined,
    };
  }
}
