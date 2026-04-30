import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsPhoneNumber, MinLength } from 'class-validator';

export class UpdateMeDto {
  @ApiPropertyOptional({ example: 'احمد الحربي' })
  @IsOptional()
  @IsString()
  @MinLength(3)
  name?: string;

  @ApiPropertyOptional({ example: '+966500000001' })
  @IsOptional()
  @IsPhoneNumber()
  phone?: string;
}
