import {
  Body,
  Controller,
  Get,
  Headers,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';

import { CreatePaymentDto } from './dto/create-payment.dto';
import { ListPaymentsDto } from './dto/list-payments.dto';
import { PaymentActionDto } from './dto/payment-action.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { PaymentsService } from './payments.service';
import type { User } from '../../generated/client';
import { GetCurrentUser } from '../auth/decorators/get-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

type RawBodyRequest = Request & { rawBody?: Buffer };

@ApiTags('payments')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  createPayment(
    @Body() dto: CreatePaymentDto,
    @GetCurrentUser() user: User,
    @Headers('idempotency-key') idempotencyKey?: string,
  ) {
    return this.paymentsService.createPayment(dto, user, idempotencyKey);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  listPayments(@Query() query: ListPaymentsDto) {
    return this.paymentsService.listPayments(query);
  }

  @Get('webhook-events')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  listWebhookEvents(@Query('limit') limit?: string) {
    return this.paymentsService.listWebhookEvents(limit ? Number(limit) : undefined);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  fetchPayment(@Param('id') id: string) {
    return this.paymentsService.fetchPayment(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  updatePayment(@Param('id') id: string, @Body() dto: UpdatePaymentDto) {
    return this.paymentsService.updatePayment(id, dto);
  }

  @Post(':id/refund')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  refundPayment(
    @Param('id') id: string,
    @Body() dto: PaymentActionDto,
    @GetCurrentUser() user: User,
    @Headers('idempotency-key') idempotencyKey?: string,
  ) {
    return this.paymentsService.refundPayment(id, dto, user, idempotencyKey);
  }

  @Post(':id/capture')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  capturePayment(
    @Param('id') id: string,
    @Body() dto: PaymentActionDto,
    @Headers('idempotency-key') idempotencyKey?: string,
  ) {
    return this.paymentsService.capturePayment(id, dto, idempotencyKey);
  }

  @Post(':id/void')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  voidPayment(@Param('id') id: string, @Headers('idempotency-key') idempotencyKey?: string) {
    return this.paymentsService.voidPayment(id, idempotencyKey);
  }

  @Post('webhooks/moyasar')
  handleMoyasarWebhook(
    @Body() payload: unknown,
    @Headers() headers: Record<string, string>,
    @Req() req: RawBodyRequest,
  ) {
    return this.paymentsService.handleWebhook(payload, headers, req.rawBody);
  }
}
