import { Injectable } from '@nestjs/common';

import { ListPaymentsDto } from './dto/list-payments.dto';
import {
  PaymentMethod,
  PaymentStatus,
  Prisma,
  RefundMethod,
  RefundStatus,
} from '../../generated/client';
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
  paymentMethod?: PaymentMethod;
  amount?: number;
  currency?: string;
  refundedAmount?: number;
  capturedAmount?: number;
  metadata?: unknown;
  rawGatewayResponse?: unknown;
};

type PaymentFilterQuery = Pick<
  ListPaymentsDto,
  'status' | 'orderId' | 'search' | 'instructorId' | 'dateFrom' | 'dateTo'
>;

const paymentInclude = {
  payer: { select: { id: true, name: true, email: true } },
  student: { select: { id: true, name: true, email: true } },
  course: {
    select: {
      id: true,
      title: true,
      teacherUserId: true,
      teacher: { select: { id: true, name: true, email: true } },
    },
  },
  webhookEvents: { orderBy: { processedAt: 'desc' as const }, take: 20 },
} satisfies Prisma.PaymentInclude;

@Injectable()
export class PaymentsRepository {
  constructor(private readonly prisma: PrismaService) {}

  findById(id: string) {
    return this.prisma.payment.findUnique({
      where: { id },
      include: paymentInclude,
    });
  }

  findByMoyasarPaymentId(moyasarPaymentId: string) {
    return this.prisma.payment.findUnique({
      where: { moyasarPaymentId },
      include: paymentInclude,
    });
  }

  findByIdempotencyKey(idempotencyKey: string) {
    return this.prisma.payment.findUnique({
      where: { idempotencyKey },
      include: paymentInclude,
    });
  }

  list(query: ListPaymentsDto) {
    return this.prisma.payment.findMany({
      where: this.whereFromQuery(query),
      orderBy: { createdAt: 'desc' },
      skip: query.offset,
      take: query.limit,
      include: {
        ...paymentInclude,
        webhookEvents: { orderBy: { processedAt: 'desc' }, take: 5 },
      },
    });
  }

  count(query: ListPaymentsDto) {
    return this.prisma.payment.count({ where: this.whereFromQuery(query) });
  }

  listForSummary(query: PaymentFilterQuery) {
    return this.prisma.payment.findMany({
      where: this.whereFromQuery(query),
      select: {
        amount: true,
        refundedAmount: true,
        status: true,
        createdAt: true,
      },
    });
  }

  listMonthlyRevenue(query: PaymentFilterQuery, year: number) {
    const start = new Date(Date.UTC(year, 0, 1));
    const end = new Date(Date.UTC(year + 1, 0, 1));

    return this.prisma.payment.findMany({
      where: this.whereFromQuery({
        ...query,
        dateFrom: start.toISOString(),
        dateTo: end.toISOString(),
      }),
      select: {
        amount: true,
        refundedAmount: true,
        status: true,
        createdAt: true,
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
      include: paymentInclude,
    });
  }

  updateGatewayState(paymentId: string, gateway: GatewaySync) {
    return this.prisma.payment.update({
      where: { id: paymentId },
      data: this.gatewayUpdateData(gateway),
      include: paymentInclude,
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
      include: paymentInclude,
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
      paymentMethod: gateway.paymentMethod,
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

  private whereFromQuery(query: PaymentFilterQuery): Prisma.PaymentWhereInput {
    const search = query.search?.trim();
    const createdAt: Prisma.DateTimeFilter = {};

    if (query.dateFrom) createdAt.gte = new Date(query.dateFrom);
    if (query.dateTo) createdAt.lte = new Date(query.dateTo);

    return {
      status: query.status,
      orderId: query.orderId,
      ...(Object.keys(createdAt).length > 0 && { createdAt }),
      ...(query.instructorId && { course: { teacherUserId: query.instructorId } }),
      ...(search && {
        OR: [
          { orderId: { contains: search, mode: 'insensitive' } },
          { moyasarPaymentId: { contains: search, mode: 'insensitive' } },
          { student: { name: { contains: search, mode: 'insensitive' } } },
          { student: { email: { contains: search, mode: 'insensitive' } } },
          { course: { title: { contains: search, mode: 'insensitive' } } },
          { course: { teacher: { name: { contains: search, mode: 'insensitive' } } } },
        ],
      }),
    };
  }
}
