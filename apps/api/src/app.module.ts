import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ScheduleModule } from '@nestjs/schedule';

import { AppController } from './app.controller';
import { AuthModule } from './modules/auth/auth.module';
import { CoursesModule } from './modules/courses/courses.module';
import { EnrollmentModule } from './modules/enrollments/enrollment.module';
import { LessonsModule } from './modules/lessons/lessons.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { ProgressModule } from './modules/progress/progress.module';
import { QuizzesModule } from './modules/quizzes/quizzes.module';
import { UsersModule } from './modules/users/users.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    // Global config
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '../../.env',
    }),

    // Database
    PrismaModule,

    // Event Emitter
    EventEmitterModule.forRoot(),

    // Cron Jobs
    ScheduleModule.forRoot(),

    // Feature modules
    UsersModule,
    CoursesModule,
    LessonsModule,
    EnrollmentModule,
    QuizzesModule,
    ProgressModule,
    PaymentsModule,
    NotificationsModule,
    AuthModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
