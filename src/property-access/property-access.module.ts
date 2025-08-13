import { Module } from '@nestjs/common';
import { PropertyAccessService } from './property-access.service';
import { PropertyAccessController } from './property-access.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TodoItemShares } from 'src/entities/todoItemsShare.entity';
import { TodoListShares } from 'src/entities/todoListShare.entity';
import { AuthModule } from 'src/auth/auth.module';
import { TodoItemAccessService } from './todo-item-access.service';
import { TodoListAccessService } from './todo-list-access.service';
import { TodoListModule } from 'src/todo-list/todo-list.module';
import { TodoItemModule } from 'src/todo-item/todo-item.module';

@Module({
  imports: [
    AuthModule,
    TodoListModule,
    TodoItemModule,
    TypeOrmModule.forFeature([TodoItemShares, TodoListShares]),
  ],
  controllers: [PropertyAccessController],
  providers: [
    PropertyAccessService,
    TodoItemAccessService,
    TodoListAccessService,
  ],
})
export class PropertyAccessModule {}
