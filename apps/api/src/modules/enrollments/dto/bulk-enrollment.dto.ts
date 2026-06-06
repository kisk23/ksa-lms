import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsUUID,
  IsOptional,
  IsDateString,
  IsString,
  Matches,
  IsArray,
  ArrayMaxSize,
  ValidateNested,
  IsNotEmpty,
} from 'class-validator';

export class BulkEnrollItemDto {
  @ApiProperty({ description: 'UUID of the student' })
  @IsUUID()
  studentUserId!: string;

  @ApiPropertyOptional({
    description: 'Amount paid as a string. Defaults to "0".',
    example: '150.00',
  })
  @IsOptional()
  @IsString()
  @Matches(/^\d+(\.\d{1,2})?$/, {
    message: 'amountPaid must be a valid decimal string (e.g. "150" or "150.00").',
  })
  @Transform(({ value }) => value ?? '0')
  amountPaid?: string;

  @ApiPropertyOptional({
    description: 'Optional expiry date (ISO 8601).',
    example: '2027-06-01T00:00:00Z',
  })
  @IsOptional()
  @IsDateString()
  expiryDate?: string;
}

export class BulkEnrollDto {
  @ApiProperty({ description: 'UUID of the course to enroll students in' })
  @IsUUID()
  courseId!: string;

  @ApiProperty({
    type: [BulkEnrollItemDto],
    description:
      'List of student enrollment items. Up to 100 students can be enrolled in a single bulk operation.',
  })
  @IsArray()
  @IsNotEmpty()
  @ArrayMaxSize(100)
  @ValidateNested({ each: true })
  @Type(() => BulkEnrollItemDto)
  students!: BulkEnrollItemDto[];
}
