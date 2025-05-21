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
import { ProjectService } from '../services/project.service';
import { TransformInterceptor } from 'src/common/interceptors/transform.interceptor';
import { ProjectResponseDto } from '../dtos/project-response.dto';
import { Project } from '../entities/project.entity';
import { UpdateProjectDto } from '../dtos/update-project.dto';
import { CreateProjectDto } from '../dtos/create-project.dto';

@Controller(Route.PROJECTS)
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Get()
  @UseInterceptors(new TransformInterceptor(ProjectResponseDto))
  async list(): Promise<Project[]> {
    return this.projectService.findAll();
  }

  @Post()
  @UseInterceptors(new TransformInterceptor(ProjectResponseDto))
  async create(@Body() data: CreateProjectDto): Promise<Project> {
    return this.projectService.create(data);
  }

  @Put(':id')
  @UseInterceptors(new TransformInterceptor(ProjectResponseDto))
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateProjectDto,
  ): Promise<Project> {
    return this.projectService.update(id, data);
  }

  @Delete(':id')
  async delete(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ message: string }> {
    await this.projectService.delete(id);
    return { message: `Project with id ${id} deleted successfully` };
  }
}
