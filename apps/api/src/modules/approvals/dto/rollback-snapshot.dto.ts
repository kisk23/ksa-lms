import { IsUUID } from 'class-validator';

export class RollbackSnapshotDto {
  @IsUUID()
  snapshotId!: string;
}
