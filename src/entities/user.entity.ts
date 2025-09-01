import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import Credential from './credential.entity';
import TodoList from './todoList.entity';
import { TodoItem } from './todoItem.entity';
import { Attachment } from './attachment.entity';
import { UserPropertyAccess } from './userPropertyAccess.entity';

export enum Roles {
  ADMIN = 'admin',
  USER = 'user',
  SUPER_ADMIN = 'superAdmin',
}

@Entity({ name: 'users' })
export default class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  role: Roles;

  @Column({ nullable: true, default: null })
  avatar?: string | null;

  @Column()
  email: string;

  @OneToMany(() => Credential, (credential) => credential.user, {
    cascade: true,
  })
  credentials: Credential[];

  @OneToMany(() => TodoList, (todoList) => todoList.createdBy, {
    cascade: true,
  })
  todoLists: TodoList[];

  @OneToMany(() => TodoItem, (todoItem) => todoItem.createdBy, {
    cascade: true,
  })
  todoItems: TodoItem[];

  @OneToMany(() => UserPropertyAccess, (userTodo) => userTodo.user)
  propertyAccesses: UserPropertyAccess[];

  @OneToMany(() => Attachment, (attachment) => attachment.uploadedBy)
  attachments: Attachment[];
}
