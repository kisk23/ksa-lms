import { CourseStatus } from '@lms/shared-types';
import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsOptional, IsEnum } from 'class-validator';

import { CreateCourseDto } from './create-course.dto';

export class UpdateCourseDto extends PartialType(CreateCourseDto) {
  @ApiPropertyOptional({ enum: CourseStatus })
  @IsOptional()
  @IsEnum(CourseStatus)
  status?: CourseStatus;
}
