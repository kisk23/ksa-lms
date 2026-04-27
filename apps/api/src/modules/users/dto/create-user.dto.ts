import { IsString, MinLength, IsEnum, IsOptional, IsPhoneNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';

export class CreateUserDto {
  @ApiProperty({ example: 'احمد الحربي' })
  @IsString()
  @MinLength(3)
  name: string;

  @ApiProperty({ example: 'ahmed@sulam.sa', description: 'Email, Username or National ID' })
  @IsString()
  @MinLength(3)
  identity: string;

  @ApiPropertyOptional({ example: '+966500000001' })
  @IsOptional()
  @IsPhoneNumber()
  phone?: string;

  @ApiProperty({ minLength: 8 })
  @IsString()
  @MinLength(8)
  password: string;

  @ApiPropertyOptional({ enum: UserRole, default: UserRole.STUDENT })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole = UserRole.STUDENT;
}
