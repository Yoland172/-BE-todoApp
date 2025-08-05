import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseDateEntity } from './utils/base-date.entity';
import User from './user.entity';
import { TodoItem } from './todoItem.entity';
import TodoList from './todoList.entity';

@Entity()
export class Attachment extends BaseDateEntity {
  @Column()
  name: string;

  @Column()
  content_type: string;

  @Column()
  sizeBytes: number;

  @ManyToOne(() => User, (user) => user.attachments)
  uploadedBy: User;

  @ManyToOne(() => TodoItem, (todoItem) => todoItem.attachments, {
    nullable: true,
  })
  todoItem: TodoItem | null;

  @ManyToOne(() => TodoList, (todoList) => todoList.attachments, {
    nullable: true,
  })
  todoList: TodoList | null;
}
