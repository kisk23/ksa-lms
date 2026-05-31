import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min, Max } from 'class-validator';

export class UpdateWatchPctDto {
  @ApiProperty({ minimum: 0, maximum: 100, example: 75 })
  @IsInt()
  @Min(0)
  @Max(100)
  watchedPct!: number;
}
