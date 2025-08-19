import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AddMembersDto } from './dto/add-members.dto';
import { AccessLevel } from 'src/entities/utils/types';
import { TodoItemService } from 'src/todo-item/todo-item.service';
import { rolesPriority } from './utils';

@Injectable()
export class TodoItemAccessService {
  constructor(private readonly todoItemService: TodoItemService) {}

  // async addMemberToItem(
  //   userId: number,
  //   itemId: number,
  //   members: AddMembersDto,
  // ) {
  //   const item = await this.todoItemService.findOne(itemId, userId, true);

  //   if (members.users.some((e) => e.id === item.createdBy.id)) {
  //     throw new BadRequestException('cant add access to owner of property');
  //   }

  //   if (!item) {
  //     throw new NotFoundException('not found any related items');
  //   }

  //   const accessLevel = item.shares.find(
  //     (el) => el.user.id === userId,
  //   )?.accessLevel;

  //   if (accessLevel === AccessLevel.READER)
  //     throw new ForbiddenException(
  //       'user don`t have access for managing users ',
  //     );

  //   if (item.createdBy.id === userId) {
  //     // [Note]: Owner

  //     await this.processMembers(itemId, members, userId);
  //   }

  //   const failedProcessedMembers = await this.processMembers(
  //     itemId,
  //     members,
  //     userId,
  //     true,
  //     accessLevel,
  //   );

  //   if (failedProcessedMembers.length)
  //     throw new ConflictException({
  //       message: 'Conflicted access level with following users',
  //       failedUsers: failedProcessedMembers,
  //     });

  //   return {
  //     message: 'Success',
  //   };
  // }

  // async removeMemberFromItem(itemId: number, userId: number, memberId: number) {
  //   const item = await this.todoItemService.findOne(itemId, userId, true);

  //   const userAccessLevel = item.shares.find(
  //     (el) => el.user.id === userId,
  //   )?.accessLevel;

  //   console.log(item);

  //   const memberAccessLevel = item.shares.find(
  //     (el) => el.user.id === memberId,
  //   )?.accessLevel;

  //   if (userAccessLevel === AccessLevel.READER)
  //     throw new ForbiddenException(
  //       'user don`t have access for managing users ',
  //     );

  //   if (item.createdBy.id === memberId) {
  //     throw new BadRequestException('Can`t delete the owner of item');
  //   }

  //   console.log(userAccessLevel, memberAccessLevel);

  //   const userRoleValue = rolesPriority.indexOf(userAccessLevel);
  //   const memberRoleValue = rolesPriority.indexOf(memberAccessLevel);

  //   if (userRoleValue <= memberRoleValue) {
  //     throw new BadRequestException(
  //       'User have lower access then target member',
  //     );
  //   }

  //   const res = await this.todoItemSharesRepo.delete({
  //     user: { id: memberId },
  //     todoItem: { id: itemId },
  //   });

  //   return res;
  // }

  // private async processMembers(
  //   itemId,
  //   members: AddMembersDto,
  //   userId: number,
  //   checkLevel?: boolean,
  //   userAccessLevel?: AccessLevel,
  // ) {
  //   const failed = [];

  //   for await (const member of members.users) {
  //     if (checkLevel) {
  //       const userRoleValue = rolesPriority.indexOf(userAccessLevel);
  //       const memberRoleValue = rolesPriority.indexOf(member.role);
  //       if (userRoleValue <= memberRoleValue) {
  //         failed.push(member);
  //         continue;
  //       }

  //       if (userId === member.id) {
  //         failed.push(member);
  //         continue;
  //       }
  //     }

  //     const share = this.todoItemSharesRepo.create({
  //       grantedUser: { id: userId },
  //       accessLevel: member.role,
  //       todoItem: itemId,
  //       user: { id: member.id },
  //     });
  //     try {
  //       await this.todoItemSharesRepo.save(share);
  //     } catch (e) {
  //       throw new BadRequestException(e.message);
  //     }

  //     console.log(failed);
  //   }
  //   return failed;
  // }
}
