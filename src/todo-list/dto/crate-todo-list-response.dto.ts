import { Expose } from 'class-transformer';

export class TodoListResponseDto {
  id: number;
  title: string;
  createdAt: Date;
  updatedAt: Date;

  @Expose({ name: 'ownerId' })
  get ownerId(): number {
    // entity.todoList.owner може бути undefined, тому ?
    return (this as any).owner?.id;
  }
}
