// access/access.service.ts
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { AddMembersDto } from './dto/add-members.dto';
import { AccessLevel } from 'src/entities/utils/types';
import { AccessManagedResource, AccessRepo, ResourceReader } from './contracts';
import { ROLES_PRIORITY } from './contracts';

export abstract class AccessService<R extends AccessManagedResource> {
  constructor(
    private readonly resourceReader: ResourceReader<R>,
    private readonly accessRepo: AccessRepo,
  ) {}

  async addMembers(
    actingUserId: number,
    resourceId: number,
    members: AddMembersDto,
  ) {
    const resource = await this.resourceReader.findOne(
      actingUserId,
      resourceId,
      true,
      'query',
    );

    if (members.users.some((e) => e.id === resource.createdBy.id)) {
      throw new BadRequestException('cant add access to owner of property');
    }

    const isOwner = resource.createdBy.id === actingUserId;

    if (isOwner) {
      await this.processMembers(resourceId, members, actingUserId);
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
    resourceId: number,
    actingUserId: number,
    memberId: number,
  ) {
    if (memberId === actingUserId) {
      throw new BadRequestException('can`t delete yourself');
    }

    const resource = await this.resourceReader.findOne(
      actingUserId,
      resourceId,
      true,
      'query',
    );

    const isOwner = resource.createdBy.id === actingUserId;

    if (!isOwner) {
      const userAccessLevel = resource.accessList.find(
        (el) => el.userId === actingUserId,
      )?.role;
      const memberAccessLevel = resource.accessList.find(
        (el) => el.userId === memberId,
      )?.role;

      if (!memberAccessLevel) {
        throw new NotFoundException('not found related user ');
      }
      if (userAccessLevel === AccessLevel.READER) {
        throw new ForbiddenException(
          'user don`t have access for managing users ',
        );
      }

      console.log(userAccessLevel, memberAccessLevel);

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

    const res = await this.accessRepo.delete({
      userId: memberId,
      resourceId,
    });

    return {
      message: 'successfully deleted',
      data: res,
    };
  }

  private async processMembers(
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

      try {
        await this.accessRepo.insert({
          userId: member.id,
          resourceId,
          role: member.role,
        });
      } catch (e: any) {
        // зберігаємо твою семантику помилки
        throw new BadRequestException(e?.message ?? 'Failed to insert access');
      }
    }

    return failed;
  }
}
