import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length, MinLength } from 'class-validator';

export class VerifyOtpDto {
  @ApiProperty({ example: '1100223344', description: 'Identity or Phone Number' })
  @IsString()
  @MinLength(8)
  identity!: string;

  @ApiProperty({ example: '123456' })
  @IsString()
  @Length(6, 6)
  code!: string;
}
