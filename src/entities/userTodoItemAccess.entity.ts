import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import User from './user.entity';
import { TodoItem } from './todoItem.entity';
import { AccessLevel } from './utils/types';

@Index(['todoId', 'role'])
@Entity()
export class UserTodoItemAccess {
  @PrimaryColumn({ type: 'int' })
  userId: number;

  @PrimaryColumn({ type: 'int' })
  todoId: number;

  @ManyToOne(() => User, (u) => u.todoAccesses, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => TodoItem, (td) => td.accessList, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'todoId' })
  todoItem: TodoItem;

  @Column({ type: 'enum', enum: AccessLevel, default: AccessLevel.READER })
  role: AccessLevel;

  @UpdateDateColumn()
  updatedAt: Date;
}
