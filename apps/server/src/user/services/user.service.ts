import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { DeleteResult, Repository } from 'typeorm';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UpdateUserDto } from '../dtos/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOne(id: number): Promise<User | null> {
    return this.userRepository.findOneBy({ id });
  }

  async create(data: CreateUserDto): Promise<User> {
    try {
      const user = this.userRepository.create(data);
      return await this.userRepository.save(user);
    } catch (error) {
      throw new BadRequestException('Failed to create user');
    }
  }

  async update(id: number, data: UpdateUserDto): Promise<User> {
    await this.userRepository.update(id, data);
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found after update.`);
    }
    return user;
  }

  async delete(id: number): Promise<DeleteResult> {
    return this.userRepository.delete(id);
  }
}
