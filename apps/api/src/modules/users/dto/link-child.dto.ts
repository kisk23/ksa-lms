import { IsEnum, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ParentRelationship } from '@lms/shared-types';

export class LinkChildDto {
  @ApiProperty({ example: 'student-uuid-here' })
  @IsUUID()
  student_id!: string;

  @ApiProperty({ enum: ParentRelationship, example: ParentRelationship.FATHER })
  @IsEnum(ParentRelationship)
  relationship!: ParentRelationship;
}
