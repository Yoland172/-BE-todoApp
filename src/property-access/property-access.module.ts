import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { TodoListModule } from 'src/todo-list/todo-list.module';
import { TodoItemModule } from 'src/todo-item/todo-item.module';
import { PropertyAccessController } from './property-access.controller';
import { UserPropertyAccess } from 'src/entities/userPropertyAccess.entity';
import { AccessService } from './property-access.service';

@Module({
  imports: [
    AuthModule,
    TodoListModule,
    TodoItemModule,
    TypeOrmModule.forFeature([UserPropertyAccess]),
  ],
  controllers: [PropertyAccessController],
  providers: [AccessService],
})
export class PropertyAccessModule {}
