import { Column, Entity, ManyToOne } from 'typeorm';
import TodoList from './todoList.entity';
import User from './user.entity';
import { AccessLevel } from './utils/types';
import { BaseDateEntity } from './utils/base-date.entity';

@Entity()
export class TodoListShares extends BaseDateEntity {
  @ManyToOne(() => TodoList, (item) => item.shares)
  listItem: TodoList;

  @ManyToOne(() => User, (user) => user.sharesLists)
  user: User;

  @ManyToOne(() => User, (user) => user.sharedLists)
  grantedUser: User;

  @Column({ type: 'enum', enum: AccessLevel, default: AccessLevel.READER })
  accessLevel: AccessLevel;
}
