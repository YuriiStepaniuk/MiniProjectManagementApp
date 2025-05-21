import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseInterceptors,
} from '@nestjs/common';
import { Route } from 'src/enums/route.enum';
import { TaskService } from '../services/task.service';
import { Task } from '../entities/task.entity';
import { CreateTaskDto } from '../dtos/create-task.dto';
import { UpdateTaskDto } from '../dtos/update-task.dto';
import { TransformInterceptor } from 'src/common/interceptors/transform.interceptor';
import { TaskResponseDto } from '../dtos/task-response.dto';

@Controller(Route.TASKS)
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Get()
  @UseInterceptors(new TransformInterceptor(TaskResponseDto))
  async list(): Promise<Task[]> {
    return this.taskService.findAll();
  }

  @Post()
  @UseInterceptors(new TransformInterceptor(TaskResponseDto))
  async create(@Body() data: CreateTaskDto): Promise<Task> {
    return this.taskService.create(data);
  }

  @Put(':id')
  @UseInterceptors(new TransformInterceptor(TaskResponseDto))
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateTaskDto,
  ): Promise<Task> {
    return this.taskService.update(id, data);
  }

  @Delete(':id')
  async delete(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ message: string }> {
    await this.taskService.delete(id);
    return { message: `Task with id ${id} deleted successfully.` };
  }
}
