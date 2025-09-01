import { Module } from '@nestjs/common';
import { TodoItemService } from './todo-item.service';
import { TodoItemController } from './todo-item.controller';
import { AuthModule } from 'src/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TodoItem } from 'src/entities/todoItem.entity';

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([TodoItem])],
  controllers: [TodoItemController],
  providers: [TodoItemService],
  exports: [TodoItemService],
})
export class TodoItemModule {}
