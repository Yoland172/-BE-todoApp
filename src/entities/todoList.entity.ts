import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseDateEntity } from './utils/base-date.entity';
import User from './user.entity';
import { TodoItem } from './todoItem.entity';
import { TodoListShares } from './todoListShare.entity';
import { Attachment } from './attachment.entity';

@Entity()
export default class TodoList extends BaseDateEntity {
  @ManyToOne(() => User, (user) => user.todoLists)
  @JoinColumn({ name: 'ownerId' })
  owner: User;

  @Column()
  title: string;

  @OneToMany(() => TodoItem, (item) => item.listItem, { cascade: ['remove'] })
  todoItems: TodoItem[];

  @OneToMany(() => TodoListShares, (shares) => shares.listItem, {
    cascade: ['remove'],
  })
  shares: TodoListShares[];

  @OneToMany(() => Attachment, (attachments) => attachments.todoList)
  attachments: Attachment[];
}
