import { IsString, MinLength, IsEnum, IsOptional, IsPhoneNumber, ValidateIf, Matches } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserRole } from '@lms/shared-types';

export class RegisterDto {
  @ApiProperty({ example: 'احمد الحربي' })
  @IsString()
  @MinLength(2)
  name!: string;

  @ApiProperty({ example: '1100223344', description: 'National ID' })
  @IsString()
  @MinLength(8)
  identity!: string;

  @ApiProperty({ example: '+966500000001' })
  @IsPhoneNumber('SA') //only allow saudi number
  phone!: string;

  @ApiPropertyOptional({ example: '+966500000002', description: 'Father, Mother or Guardian phone (Required for Students)' })
  @ValidateIf((o) => o.role === UserRole.STUDENT)
  @IsPhoneNumber('SA')
  guardianPhone!: string;

  @ApiProperty({ minLength: 8 })
  @IsString()
  @MinLength(8)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
  message: 'Password is too weak. Must include Uppercase, Lowercase, and a Number/Symbol',
})
  password!: string;

  //what will preent any user to make teacher account and have his previlage ? ask
  @ApiPropertyOptional({ enum: [UserRole.STUDENT,UserRole.PARENT], default: UserRole.STUDENT })
  @IsOptional()
  @IsEnum([UserRole.STUDENT,UserRole.PARENT])
  role?: UserRole = UserRole.STUDENT;
}
