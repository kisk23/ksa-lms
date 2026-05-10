import { Type } from 'class-transformer';
import { IsBoolean, IsIn, IsInt, IsOptional, IsString, Length, Min } from 'class-validator';

export class PaymentSourceDto {
  @IsIn(['creditcard'])
  type!: 'creditcard';

  @IsString()
  name!: string;

  @IsString()
  number!: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  month!: number;

  @Type(() => Number)
  @IsInt()
  @Min(2026)
  year!: number;

  @IsString()
  @Length(3, 4)
  cvc!: string;

  @IsOptional()
  @IsBoolean()
  manual?: boolean;
}
