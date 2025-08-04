import {
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import TodoList from './todoList.entity';
import User from './user.entity';
import { TodoItem } from './todoItem.entity';

@Entity()
export class TodoItemShares {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => TodoItem, (item) => item.shares)
  todoItem: TodoItem;

  @ManyToOne(() => User, (user) => user.sharesLists)
  user: User;

  @ManyToOne(() => User, (user) => user.sharedLists)
  grantedUser: User;

  @CreateDateColumn()
  createdAt: Date;
}
