import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsUUID } from 'class-validator';

import { ParentRelationship } from '../../../generated/prisma/client';

export class LinkChildDto {
  @ApiProperty({ example: 'student-uuid-here' })
  @IsUUID()
  student_id!: string;

  @ApiProperty({ enum: ParentRelationship, example: ParentRelationship.FATHER })
  @IsEnum(ParentRelationship)
  relationship!: ParentRelationship;
}
