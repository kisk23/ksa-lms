import { UserRole } from '@lms/shared-types';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsEnum, IsIn } from 'class-validator';

import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';

export class AdminUsersQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({ enum: UserRole })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @ApiPropertyOptional({ enum: ['active', 'blocked', 'pending'] })
  @IsOptional()
  @IsIn(['active', 'blocked', 'pending'])
  status?: string;
}
