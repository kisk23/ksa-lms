import { Injectable } from '@nestjs/common';

@Injectable()
export class NotificationsService {
  sendGuardianCredentials(payload: { phone: string; password: string }) {
    console.log(payload);
    throw new Error('Method not implemented.');
  }
}
