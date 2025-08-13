import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TodoItemShares } from 'src/entities/todoItemsShare.entity';
import { Repository } from 'typeorm';
import { AddMembersDto } from './dto/add-members.dto';
import { AccessLevel } from 'src/entities/utils/types';
import { TodoItemService } from 'src/todo-item/todo-item.service';

@Injectable()
export class TodoItemAccessService {
  constructor(
    private readonly todoItemService: TodoItemService,
    @InjectRepository(TodoItemShares)
    private readonly todoListSharesRepo: Repository<TodoItemShares>,
  ) {}

  async addMemberToItem(
    userId: number,
    itemId: number,
    members: AddMembersDto,
  ) {
    const item = await this.todoItemService.findOne(itemId, userId, true);

    if (members.users.some((e) => e.id === item.createdBy.id)) {
      throw new BadRequestException('cant add access to owner of property');
    }

    if (!item) {
      throw new NotFoundException('not found any related items');
    }

    const accessLevel = item.shares.find(
      (el) => el.user.id === userId,
    )?.accessLevel;

    if (accessLevel === AccessLevel.READER)
      throw new ForbiddenException(
        'user don`t have access for managing users ',
      );

    if (item.createdBy.id === userId) {
      // [Note]: Owner

      await this.processMembers(itemId, members, userId);

      return {
        message: 'Success',
      };
    }

    const failedProcessedMembers = await this.processMembers(
      itemId,
      members,
      userId,
      true,
      accessLevel,
    );

    if (failedProcessedMembers.length)
      throw new ConflictException({
        message: 'Conflicted access level with following users',
        failedUsers: failedProcessedMembers,
      });
  }

  private async processMembers(
    itemId,
    members: AddMembersDto,
    userId: number,
    checkLevel?: boolean,
    userAccessLevel?: AccessLevel,
  ) {
    const rolesPriority = [AccessLevel.READER, AccessLevel.EDITOR];

    const failed = [];

    console.log(checkLevel);

    for await (const member of members.users) {
      if (checkLevel) {
        const userRoleValue = rolesPriority.indexOf(userAccessLevel);
        const memberRoleValue = rolesPriority.indexOf(member.role);
        if (userRoleValue <= memberRoleValue) {
          failed.push(member);
          continue;
        }

        if (userId === member.id) {
          failed.push(member);
          continue;
        }
      }

      const share = this.todoListSharesRepo.create({
        grantedUser: { id: userId },
        accessLevel: member.role,
        todoItem: itemId,
        user: { id: member.id },
      });
      try {
        await this.todoListSharesRepo.save(share);
      } catch (e) {
        throw new BadRequestException(e.message);
      }

      console.log(failed);
    }
    return failed;
  }
}
