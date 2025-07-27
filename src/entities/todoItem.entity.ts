import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { BaseDateEntity } from './utils/base-date.entity';
import TodoList from './todoList.entity';
import User from './user.entity';

export enum Status {
  BACKLOG = 'backlog',
  INPROGRESS = 'inProgress',
  COMPLETED = 'completed',
}

export enum Priority {
  LOWEST = 1,
  LOW = 2,
  MEDIUM = 3,
  HIGH = 4,
  CRITICAL = 5,
}

@Entity()
export class TodoItem extends BaseDateEntity {
  @ManyToOne(() => TodoList, (list) => list.todoItems, { nullable: true })
  @JoinColumn({ name: 'listId' })
  listItem?: TodoList;

  @Column()
  status: Status;

  @Column({ nullable: true })
  due_date?: Date;

  @Column({ enum: Priority, default: Priority.MEDIUM })
  priority: Priority;

  @ManyToOne(() => User, (user) => user.todoItems)
  @JoinColumn({ name: 'ownerId' })
  createdBy: User;
}
