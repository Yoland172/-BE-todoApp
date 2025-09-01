import { Module } from '@nestjs/common';
import { TodoListService } from './todo-list.service';
import { TodoListController } from './todo-list.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import TodoList from 'src/entities/todoList.entity';
import { TodoItemModule } from 'src/todo-item/todo-item.module';

@Module({
  imports: [TodoItemModule, AuthModule, TypeOrmModule.forFeature([TodoList])],
  controllers: [TodoListController],
  providers: [TodoListService],
  exports: [TodoListService],
})
export class TodoListModule {}
