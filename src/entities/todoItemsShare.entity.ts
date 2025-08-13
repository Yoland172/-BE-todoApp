import { Column, Entity, ManyToOne, Unique } from 'typeorm';
import User from './user.entity';
import { TodoItem } from './todoItem.entity';
import { AccessLevel } from './utils/types';
import { BaseDateEntity } from './utils/base-date.entity';

@Entity()
@Unique(['todoItem', 'user'])
export class TodoItemShares extends BaseDateEntity {
  @ManyToOne(() => TodoItem, (item) => item.shares)
  todoItem: TodoItem;

  @ManyToOne(() => User, (user) => user.sharesLists)
  user: User;

  @ManyToOne(() => User, (user) => user.sharedLists)
  grantedUser: User;

  @Column({ type: 'enum', enum: AccessLevel, default: AccessLevel.READER })
  accessLevel: AccessLevel;
}
