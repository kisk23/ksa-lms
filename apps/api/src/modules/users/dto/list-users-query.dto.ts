import { UserRole } from '@lms/shared-types';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';

import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';

export class ListUsersQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({ enum: UserRole })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;
}
