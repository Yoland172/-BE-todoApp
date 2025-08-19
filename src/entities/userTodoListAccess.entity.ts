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
import { AccessLevel } from './utils/types';
import TodoList from './todoList.entity';

@Index(['listId', 'role'])
@Entity()
export class UserTodoListAccess {
  @PrimaryColumn()
  userId: string;

  @PrimaryColumn()
  listId: string;

  @ManyToOne(() => User, (u) => u.listAccess, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => TodoList, (td) => td.accessList, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'listId' })
  todoList: TodoList;

  @Column({ type: 'enum', enum: AccessLevel, default: AccessLevel.READER })
  role: AccessLevel;

  @UpdateDateColumn()
  updatedAt: Date;
}
