import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { AdminUsersController } from './admin-users.controller';
import { ParentController } from './parent.controller';
import { UsersService } from './users.service';

@Module({
  controllers: [UsersController, AdminUsersController, ParentController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
