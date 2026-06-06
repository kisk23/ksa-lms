import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty } from 'class-validator';

export class ExtendEnrollmentDto {
  @ApiProperty({
    description: 'New expiry date in future (ISO 8601 string)',
    example: '2027-12-31T23:59:59Z',
  })
  @IsNotEmpty()
  @IsDateString()
  expiryDate!: string;
}
