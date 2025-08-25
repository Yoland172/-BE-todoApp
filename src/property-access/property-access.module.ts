import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserTodoItemAccess } from 'src/entities/userTodoItemAccess.entity';

import { AccessService } from './access.service';
import { TodoItemAccessService } from './item-access.service';
import { TodoListAccessService } from './list-access.service';
import { ItemResourceReader } from './adapters/item.resource-reader';
import { ItemAccessRepo } from './adapters/item.access-repo';
import { ListResourceReader } from './adapters/list.resource-reader';
import { ListAccessRepo } from './adapters/list.access-repo';
import { AuthModule } from 'src/auth/auth.module';
import { TodoListModule } from 'src/todo-list/todo-list.module';
import { TodoItemModule } from 'src/todo-item/todo-item.module';
import { PropertyAccessController } from './property-access.controller';
import { UserTodoListAccess } from 'src/entities/userTodoListAccess.entity';

@Module({
  imports: [
    AuthModule,
    TodoListModule,
    TodoItemModule,
    TypeOrmModule.forFeature([UserTodoItemAccess, UserTodoListAccess]),
  ],
  controllers: [PropertyAccessController],
  providers: [
    ItemResourceReader,
    ItemAccessRepo,
    ListResourceReader,
    ListAccessRepo,
    TodoItemAccessService,
    TodoListAccessService,
  ],
})
export class PropertyAccessModule {}
