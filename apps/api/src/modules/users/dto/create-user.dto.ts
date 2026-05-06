import { UserRole } from '@lms/shared-types';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  MinLength,
  IsEnum,
  IsOptional,
  IsEmail,
  IsNotEmpty,
  IsPhoneNumber,
  Matches,
  ValidateIf,
  Length,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'احمد الحربي' })
  @IsString()
  @MinLength(3)
  name!: string;

  @ApiPropertyOptional({ example: 'ahmed@sulam.sa' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'ahmed@sulam.sa', description: 'Email, Username or National ID' })
  @IsString()
  @Length(3, 20)
  identity!: string;

  @ApiProperty({ example: '+966500000001' })
  @IsPhoneNumber('SA') //only allow saudi number
  phone!: string;

  @ApiPropertyOptional({
    example: '+966500000002',
    description: 'Father, Mother or Guardian phone (Required for Students)',
  })
  @ValidateIf((o) => o.role === UserRole.STUDENT)
  @IsPhoneNumber('SA')
  guardianPhone!: string;

  @ApiPropertyOptional({
    example: '1000000001',
    description: 'Guardian National ID (Required for Students)',
  })
  @ValidateIf((o) => o.role === UserRole.STUDENT)
  @IsNotEmpty()
  @IsString()
  @Length(3, 20)
  guardianIdentity?: string;

  @ApiProperty({ minLength: 8 })
  @IsString()
  @MinLength(8)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Password is too weak. Must include Uppercase, Lowercase, and a Number/Symbol',
  })
  password!: string;

  @ApiPropertyOptional({ enum: UserRole, default: UserRole.STUDENT })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole = UserRole.STUDENT;
}
