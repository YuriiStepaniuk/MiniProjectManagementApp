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
import { UserService } from '../services/user.service';
import { UserResponseDto } from '../dtos/user-response.dto';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { TransformInterceptor } from 'src/common/interceptors/transform.interceptor';
import { User } from '../entities/user.entity';
import { Route } from 'src/enums/route.enum';

@Controller(Route.USERS)
export class UserController {
  constructor(private readonly userService: UserService) {}
  @UseInterceptors(new TransformInterceptor(UserResponseDto))
  @Get()
  async list(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Post()
  @UseInterceptors(new TransformInterceptor(UserResponseDto))
  async create(@Body() data: CreateUserDto): Promise<User> {
    return this.userService.create(data);
  }

  @Put(':id')
  @UseInterceptors(new TransformInterceptor(UserResponseDto))
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateUserDto,
  ): Promise<User> {
    return this.userService.update(id, data);
  }

  @Delete(':id')
  async delete(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ message: string }> {
    await this.userService.delete(id);
    const response = { message: `User with id ${id} deleted successfully.` };
    return response;
  }
}
