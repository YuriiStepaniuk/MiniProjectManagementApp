import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from '../entities/task.entity';
import { DeleteResult, FindOptionsRelations, Repository } from 'typeorm';
import { CreateTaskDto } from '../dtos/create-task.dto';
import { User } from 'src/user/entities/user.entity';
import { Project } from 'src/project/entities/project.entity';
import { TaskStatus } from '../enums/task-status.enum';
import { UpdateTaskDto } from '../dtos/update-task.dto';
import { UserService } from 'src/user/services/user.service';
import { ProjectService } from 'src/project/services/project.service';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task) private readonly taskRepository: Repository<Task>,
    private readonly userService: UserService,
    private readonly projectService: ProjectService,
  ) {}
  private readonly relations: FindOptionsRelations<Task> = {
    assignee: true,
    project: true,
  };

  async create(data: CreateTaskDto): Promise<Task> {
    const assignee = await this.userService.findOne(data.assigneeId);
    if (!assignee) {
      throw new NotFoundException(`User with ID ${data.assigneeId} not found`);
    }

    const project = await this.projectService.findOne(data.projectId);
    if (!project) {
      throw new NotFoundException(
        `Project with ID ${data.projectId} not found`,
      );
    }

    const task = this.taskRepository.create({
      title: data.title,
      description: data.description,
      status: TaskStatus.TODO,
      assignee,
      project,
    });

    return this.taskRepository.save(task);
  }

  async findAll(): Promise<Task[]> {
    return this.taskRepository.find({
      relations: this.relations,
    });
  }

  async update(id: number, data: UpdateTaskDto): Promise<Task> {
    const task = await this.taskRepository.findOne({
      where: { id },
      relations: this.relations,
    });

    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    Object.assign(task, data);
    return this.taskRepository.save(task);
  }

  async delete(id: number): Promise<DeleteResult> {
    return this.taskRepository.delete(id);
  }
}
