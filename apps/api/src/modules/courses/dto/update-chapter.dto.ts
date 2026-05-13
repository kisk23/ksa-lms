import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, MaxLength, IsNotEmpty, IsInt, Min, IsOptional } from 'class-validator';

export class UpdateChapterDto {
  @ApiPropertyOptional({ example: 'Advanced Algebra', maxLength: 255 })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title?: string;

  @ApiPropertyOptional({ example: 2, description: 'New position in the chapter list (1-based)' })
  @IsOptional()
  @IsInt()
  @Min(1)
  orderIndex?: number;
}
