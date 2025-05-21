import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from '../entities/project.entity';
import { DeleteResult, FindOptionsRelations, Repository } from 'typeorm';
import { CreateProjectDto } from '../dtos/create-project.dto';
import { UpdateProjectDto } from '../dtos/update-project.dto';
import { UserService } from 'src/user/services/user.service';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    private readonly userService: UserService,
  ) {}
  private readonly relations: FindOptionsRelations<Project> = {
    owner: true,
  };

  async create(data: CreateProjectDto): Promise<Project> {
    const owner = await this.userService.findOne(data.userId);

    if (!owner)
      throw new NotFoundException(`User with id ${data.userId} not found`);

    const project = this.projectRepository.create({
      ...data,
      owner,
    });
    return this.projectRepository.save(project);
  }

  async findAll(): Promise<Project[]> {
    return this.projectRepository.find({ relations: this.relations });
  }

  async findOne(id: number): Promise<Project> {
    const project = await this.projectRepository.findOne({
      where: { id },
      relations: this.relations,
    });
    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }
    return project;
  }

  async update(id: number, data: UpdateProjectDto): Promise<Project> {
    await this.projectRepository.update(id, data);
    const updated = await this.findOne(id);
    return updated;
  }

  async delete(id: number): Promise<DeleteResult> {
    return this.projectRepository.delete(id);
  }
}
