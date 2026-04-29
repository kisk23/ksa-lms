import { IsUUID, IsArray, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AssistantPermissionsDto {
  @ApiProperty({ example: 'assistant-uuid-here' })
  @IsUUID()
  assistant_user_id!: string;

  @ApiProperty({ example: ['DELETE_USER', 'VIEW_USERS'] })
  @IsArray()
  @IsString({ each: true })
  permissions!: string[];
}
