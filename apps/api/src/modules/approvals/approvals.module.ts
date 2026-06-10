import { Module } from '@nestjs/common';

import { ApprovalsController } from './approvals.controller';
import { ApprovalsRepository } from './approvals.repository';
import { ApprovalsService } from './approvals.service';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [ApprovalsController],
  providers: [
    ApprovalsService,
    ApprovalsRepository,
    {
      provide: 'PrismaClient',
      useClass: PrismaService,
    },
  ],
})
export class ApprovalsModule {}
