import { Type } from 'class-transformer';
import {
  IsString,
  MinLength,
  IsEmail,
  IsPhoneNumber,
  ValidateNested,
  Matches,
  Length,
  IsEnum,
} from 'class-validator';

import { ParentRelationship } from '../../../generated/client';
export class GuardianDto {
  @IsString()
  @MinLength(2)
  name!: string;

  @IsEmail()
  email!: string;

  @IsPhoneNumber('SA')
  phone!: string;

  @IsString()
  @Length(3, 20)
  identity!: string;

  // No password field — guardian gets a server-generated temporary password

  @IsEnum(ParentRelationship)
  relationship!: ParentRelationship; // ← was missing entirely
}

export class RegisterStudentDto {
  @IsString()
  @MinLength(2)
  name!: string;

  @IsEmail()
  email!: string;

  @IsPhoneNumber('SA')
  phone!: string;

  @IsString()
  @Length(3, 20)
  identity!: string;

  @IsString()
  @MinLength(8)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Password is too weak. Must include Uppercase, Lowercase, and a Number/Symbol',
  })
  password!: string;

  @ValidateNested()
  @Type(() => GuardianDto)
  guardian!: GuardianDto;
}
// export class RegisterDto {
//   @ApiProperty({ example: 'احمد الحربي' })
//   @IsString()
//   @MinLength(2)
//   name!: string;

//   @ApiPropertyOptional({ example: 'ahmed@sulam.sa' })
//   @IsEmail()
//   email!: string;

//   @ApiProperty({ example: '1100223344', description: 'National ID' })
//   @IsString()
//   @Length(3, 20)
//   identity!: string;

//   @ApiProperty({ example: '+966500000001' })
//   @IsPhoneNumber('SA') //only allow saudi number
//   phone!: string;

//   @ApiPropertyOptional({
//     example: '+966500000002',
//     description: 'Father, Mother or Guardian phone (Required for Students)',
//   })
//   @ValidateIf((o) => o.role === UserRole.STUDENT)
//   @IsPhoneNumber('SA')
//   guardianPhone!: string;

//   @ApiPropertyOptional({
//     example: '1000000001',
//     description: 'Guardian National ID (Required for Students)',
//   })
//   @ValidateIf((o) => o.role === UserRole.STUDENT)
//   @IsNotEmpty()
//   @IsString()
//   @Length(3, 20)
//   guardianIdentity?: string;

//   @ApiProperty({ minLength: 8 })
//   @IsString()
//   @MinLength(8)
//   @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
//     message: 'Password is too weak. Must include Uppercase, Lowercase, and a Number/Symbol',
//   })
//   password!: string;

//   //teacher and assistant accounts are created from admin dashboard only.
//   @ApiProperty({ enum: [UserRole.STUDENT, UserRole.PARENT]})
//   @IsEnum([UserRole.STUDENT, UserRole.PARENT])
//   role!: UserRole.STUDENT | UserRole.PARENT;
// }
