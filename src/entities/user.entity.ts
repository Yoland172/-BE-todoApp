import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import Credential from './credential.entity';
import TodoList from './todoList.entity';
import { TodoItem } from './todoItem.entity';
import { TodoListShares } from './todoListShare.entity';
import { Attachment } from './attachment.entity';

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

  @OneToMany(() => TodoList, (todoList) => todoList.owner, {
    cascade: true,
  })
  todoLists: TodoList[];

  @OneToMany(() => TodoItem, (todoItem) => todoItem.createdBy, {
    cascade: true,
  })
  todoItems: TodoItem[];

  @OneToMany(() => TodoListShares, (shareLists) => shareLists.user, {
    cascade: true,
  })
  sharesLists: TodoListShares[];

  @OneToMany(() => TodoListShares, (shareLists) => shareLists.grantedUser, {
    cascade: true,
  })
  sharedLists: TodoListShares[];

  @OneToMany(() => Attachment, (attachment) => attachment.uploadedBy)
  attachments: Attachment[];
}
