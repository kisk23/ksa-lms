import { Module } from '@nestjs/common';

// eslint-disable-next-line import/no-unresolved
import { NotificationsService } from './notifications.service';

@Module({ controllers: [], providers: [NotificationsService], exports: [NotificationsService] })
export class NotificationsModule {}
