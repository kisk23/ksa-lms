import { Module } from '@nestjs/common';

import { AdminUsersController } from './admin-users.controller';
import { ParentController } from './parent.controller';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  controllers: [UsersController, AdminUsersController, ParentController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
