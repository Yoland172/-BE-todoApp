import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseDateEntity } from './utils/base-date.entity';
import User from './user.entity';
import { TodoItem } from './todoItem.entity';
import { Attachment } from './attachment.entity';
import { UserTodoListAccess } from './userTodoListAccess.entity';

@Entity()
export default class TodoList extends BaseDateEntity {
  @ManyToOne(() => User, (user) => user.todoLists)
  @JoinColumn({ name: 'ownerId' })
  createdBy: User;

  @Column()
  title: string;

  @OneToMany(() => TodoItem, (item) => item.listItem, { cascade: ['remove'] })
  todoItems: TodoItem[];

  @OneToMany(() => UserTodoListAccess, (td) => td.todoList, {
    onDelete: 'CASCADE',
  })
  accessList: UserTodoListAccess[];

  @OneToMany(() => Attachment, (attachments) => attachments.todoList)
  attachments: Attachment[];
}
