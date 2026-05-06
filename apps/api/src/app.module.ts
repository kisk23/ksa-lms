import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AssignmentsModule } from './modules/assignments/assignments.module';
import { AuthModule } from './modules/auth/auth.module';
import { CoursesModule } from './modules/courses/courses.module';
import { EnrollmentsModule } from './modules/enrollments/enrollments.module';
import { LessonsModule } from './modules/lessons/lessons.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { PaymentsModule } from './modules/payments/payments.module';
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

    // Feature modules
    UsersModule,
    CoursesModule,
    LessonsModule,
    EnrollmentsModule,
    QuizzesModule,
    AssignmentsModule,
    PaymentsModule,
    NotificationsModule,
    AuthModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
