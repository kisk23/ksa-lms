import { Module } from '@nestjs/common';

import { EnrollmentController } from './enrollment.controller';
import { EnrollmentService } from './enrollment.service';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [EnrollmentController],
  providers: [EnrollmentService],
  /**
   * EnrollmentService is exported so other modules can call isEnrolled()
   * from their guards (EnrollmentGuard, LessonAccessGuard, AssignmentAccessGuard)
   * without creating circular dependencies.
   */
  exports: [EnrollmentService],
})
export class EnrollmentModule {}
