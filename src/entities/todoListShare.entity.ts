import {
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import TodoList from './todoList.entity';
import User from './user.entity';

@Entity()
export class TodoListShares {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => TodoList, (item) => item.shares)
  listItem: TodoList;

  @ManyToOne(() => User, (user) => user.sharesLists)
  user: User;

  @ManyToOne(() => User, (user) => user.sharedLists)
  grantedUser: User;

  @CreateDateColumn()
  createdAt: Date;
}
