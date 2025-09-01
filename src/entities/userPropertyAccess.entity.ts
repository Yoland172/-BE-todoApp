import {
  Check,
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import User from './user.entity';
import { AccessLevel, Property } from './utils/types';
import { TodoItem } from './todoItem.entity';
import TodoList from './todoList.entity';

@Index('UQ_user_item', ['userId', 'todoItemId'], {
  unique: true,
  where: `"todoItemId" IS NOT NULL`,
})
@Index('UQ_user_list', ['userId', 'todoListId'], {
  unique: true,
  where: `"todoListId" IS NOT NULL`,
})
@Check(`(
  ("propertyType" = '${Property.ITEM}' AND "todoItemId" IS NOT NULL AND "todoListId" IS NULL) OR
  ("propertyType" = '${Property.LIST}' AND "todoListId" IS NOT NULL AND "todoItemId" IS NULL)
)`)
@Entity()
export class UserPropertyAccess {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  userId: number;

  @ManyToOne(() => User, (u) => u.propertyAccesses, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ type: 'enum', enum: Property })
  propertyType: Property;

  @Column({ type: 'int', nullable: true })
  todoItemId?: number;

  @ManyToOne(() => TodoItem, (td) => td.accessList, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'todoItemId' })
  todoItem?: TodoItem;

  @Column({ type: 'int', nullable: true })
  todoListId?: number;

  @ManyToOne(() => TodoList, (tl) => tl.accessList, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'todoListId' })
  todoList?: TodoList;

  @Index()
  @Column({ type: 'enum', enum: AccessLevel, default: AccessLevel.READER })
  role: AccessLevel;

  @UpdateDateColumn()
  updatedAt: Date;
}
