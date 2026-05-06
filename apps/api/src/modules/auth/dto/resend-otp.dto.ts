import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ResendOtpDto {
  @ApiProperty({ example: '1100223344', description: 'Identity (National ID) or Phone Number' })
  @IsString()
  identity!: string;
}
