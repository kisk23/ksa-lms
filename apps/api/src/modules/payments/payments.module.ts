import { Module } from '@nestjs/common';

import { MoyasarClient } from './moyasar.client';
import { PaymentsController } from './payments.controller';
import { PaymentsRepository } from './payments.repository';
import { PaymentsService } from './payments.service';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [PaymentsController],
  providers: [PaymentsService, PaymentsRepository, MoyasarClient],
  exports: [PaymentsService],
})
export class PaymentsModule {}
