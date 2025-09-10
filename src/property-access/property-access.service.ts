// access/access.service.ts
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { AddMembersDto } from './dto/add-members.dto';
import { AccessLevel, Property } from 'src/entities/utils/types';
import { ROLES_PRIORITY } from './utils';
import { TodoItemService } from 'src/todo-item/todo-item.service';
import { TodoListService } from 'src/todo-list/todo-list.service';
import { InjectRepository } from '@nestjs/typeorm';
import { UserPropertyAccess } from 'src/entities/userPropertyAccess.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AccessService {
  constructor(
    private readonly todoItemService: TodoItemService,
    private readonly todoListService: TodoListService,
    @InjectRepository(UserPropertyAccess)
    private readonly accessRepo: Repository<UserPropertyAccess>,
  ) {}

  async addMembers(
    actingUserId: number,
    propertyType: Property,
    resourceId: number,
    members: AddMembersDto,
  ) {
    console.log(actingUserId, resourceId);

    const resource = await this.loadResource(
      propertyType,
      actingUserId,
      resourceId,
    );

    if (members.users.some((e) => e.id === resource.createdBy.id)) {
      throw new BadRequestException('cant add access to owner of property');
    }

    const isOwner = resource.createdBy.id === actingUserId;

    if (isOwner) {
      await this.processMembers(
        propertyType,
        resourceId,
        members,
        actingUserId,
      );
    } else {
      const accessLevel = resource.accessList.find(
        (el) => el.userId === actingUserId,
      )?.role;

      if (accessLevel === AccessLevel.READER) {
        throw new ForbiddenException(
          'user don`t have access for managing users ',
        );
      }

      const failedProcessedMembers = await this.processMembers(
        propertyType,
        resourceId,
        members,
        actingUserId,
        true,
        accessLevel,
      );

      if (failedProcessedMembers.length) {
        throw new ConflictException({
          message: 'Conflicted access level with following users',
          failedUsers: failedProcessedMembers,
        });
      }
    }

    return { message: 'Success' };
  }

  async removeMember(
    propertyType: Property,
    resourceId: number,
    actingUserId: number,
    memberId: number,
  ) {
    if (memberId === actingUserId) {
      throw new BadRequestException('can`t delete yourself');
    }

    const resource = await this.loadResource(
      propertyType,
      actingUserId,
      resourceId,
    );

    const isOwner = resource.createdBy.id === actingUserId;

    if (!isOwner) {
      const userAccessLevel = resource.accessList.find(
        (el) => el.userId === actingUserId,
      )?.role;
      const memberAccessLevel = resource.accessList.find(
        (el) => el.userId === memberId,
      )?.role;

      if (userAccessLevel === AccessLevel.READER) {
        throw new ForbiddenException(
          'user don`t have access for managing users ',
        );
      }

      if (userAccessLevel === memberAccessLevel) {
        throw new ForbiddenException('can`t delete user with same role ');
      }

      if (resource.createdBy.id === memberId) {
        throw new BadRequestException('Can`t delete the owner of item');
      }

      const userRoleValue = ROLES_PRIORITY.indexOf(userAccessLevel as any);
      const memberRoleValue = ROLES_PRIORITY.indexOf(memberAccessLevel as any);

      if (userRoleValue <= memberRoleValue) {
        throw new BadRequestException(
          'User have lower access then target member',
        );
      }
    }

    const deleteCriteria =
      propertyType === Property.ITEM
        ? { userId: memberId, todoItemId: resourceId }
        : { userId: memberId, todoListId: resourceId };

    const res = await this.accessRepo.delete(deleteCriteria);

    return {
      message: 'successfully deleted',
      data: res,
    };
  }

  private async processMembers(
    propertyType: Property,
    resourceId: number,
    members: AddMembersDto,
    actingUserId: number,
    checkLevel?: boolean,
    userAccessLevel?: AccessLevel,
  ) {
    const failed: typeof members.users = [];

    for await (const member of members.users) {
      if (checkLevel) {
        const userRoleValue = ROLES_PRIORITY.indexOf(userAccessLevel as any);
        const memberRoleValue = ROLES_PRIORITY.indexOf(member.role as any);

        if (userRoleValue <= memberRoleValue) {
          failed.push(member);
          continue;
        }

        if (actingUserId === member.id) {
          failed.push(member);
          continue;
        }
      }
      // knvhdfkndvfj

      try {
        const payload =
          propertyType === Property.ITEM
            ? {
                userId: member.id,
                todoItemId: resourceId,
                role: member.role,
                propertyType,
              }
            : {
                userId: member.id,
                todoListId: resourceId,
                role: member.role,
                propertyType,
              };

        await this.accessRepo.insert(payload);
      } catch (e: any) {
        throw new BadRequestException(e?.message ?? 'Failed to insert access');
      }
    }

    return failed;
  }

  // Маршрутизація до правильного сервісу
  private async loadResource(
    propertyType: Property,
    actingUserId: number,
    resourceId: number,
  ) {
    if (propertyType === Property.ITEM) {
      return this.todoItemService.findOne(
        actingUserId,
        resourceId,
        true,
        'query',
      );
    }
    if (propertyType === Property.LIST) {
      return this.todoListService.findOne(
        resourceId,
        actingUserId,
        true,
        'query',
      );
    }
    throw new BadRequestException('Unknown property type');
  }
}
