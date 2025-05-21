import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { UserModule } from 'src/user/user.module';
import { ProjectModule } from 'src/project/project.module';
import { TaskService } from './services/task.service';
import { TaskController } from './controllers/task.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Task]), UserModule, ProjectModule],
  controllers: [TaskController],
  providers: [TaskService],
  exports: [],
})
export class TaskModule {}
