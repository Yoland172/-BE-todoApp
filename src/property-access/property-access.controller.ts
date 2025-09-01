import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
// import { PropertyAccessService } from './property-access.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { WithAuthRequest } from 'src/lib/types/requests';
import { AddMembersDto } from './dto/add-members.dto';
import { AccessService } from './property-access.service';
import { Property } from 'src/entities/utils/types';

@UseGuards(JwtAuthGuard)
@Controller('property-access')
export class PropertyAccessController {
  constructor(private readonly accessService: AccessService) {}

  @Post('todo-item/:id/add')
  async addMemberToItem(
    @Req() req: WithAuthRequest,
    @Param('id') itemId: string,
    @Body() body: AddMembersDto,
  ) {
    return await this.accessService.addMembers(
      req.user.sub,
      Property.ITEM,
      +itemId,
      body,
    );
  }

  @Post('todo-list/:id/add')
  async addMemberToList(
    @Req() req: WithAuthRequest,
    @Param('id') itemId: string,
    @Body() body: AddMembersDto,
  ) {
    return await this.accessService.addMembers(
      req.user.sub,
      Property.LIST,
      +itemId,
      body,
    );
  }

  @Delete('todo-list/:id')
  async removeMemberFromList(
    @Param('id') id: string,
    @Req() req: WithAuthRequest,
    @Query('memberId') memberId: string,
  ) {
    return this.accessService.removeMember(
      Property.LIST,
      +id,
      req.user.sub,
      +memberId,
    );
  }

  @Delete('todo-item/:id')
  async removeMemberFromItem(
    @Param('id') id: string,
    @Req() req: WithAuthRequest,
    @Query('memberId') memberId: string,
  ) {
    return this.accessService.removeMember(
      Property.ITEM,
      +id,
      req.user.sub,
      +memberId,
    );
  }
}
