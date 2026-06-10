import { Module } from '@nestjs/common';

import { ApprovalsController } from './approvals.controller';
import { ApprovalsRepository } from './approvals.repository';
import { ApprovalsService } from './approvals.service';

@Module({
  controllers: [ApprovalsController],
  providers: [ApprovalsService, ApprovalsRepository],
})
export class ApprovalsModule {}
