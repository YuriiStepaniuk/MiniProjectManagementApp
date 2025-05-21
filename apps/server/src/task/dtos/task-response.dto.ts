import { Exclude, Expose } from 'class-transformer';
import { TaskStatus } from '../enums/task-status.enum';

@Exclude()
export class TaskResponseDto {
  @Expose()
  id: number;

  @Expose()
  title: string;

  @Expose()
  description: string;

  @Expose()
  status: TaskStatus;
}
