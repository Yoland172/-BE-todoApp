import { Module } from '@nestjs/common';
import { TodoListService } from './todo-list.service';
import { TodoListController } from './todo-list.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import TodoList from 'src/entities/todoList.entity';
import User from 'src/entities/user.entity';

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([TodoList, User])],
  controllers: [TodoListController],
  providers: [TodoListService],
})
export class TodoListModule {}
