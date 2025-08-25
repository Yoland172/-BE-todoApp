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
import { TodoItemAccessService } from './item-access.service';
import { TodoListAccessService } from './list-access.service';

@UseGuards(JwtAuthGuard)
@Controller('property-access')
export class PropertyAccessController {
  constructor(
    // private readonly propertyAccessService: PropertyAccessService,
    // private readonly todoItemAccessService: TodoItemAccessService,

    private readonly todoItemAccessService: TodoItemAccessService,
    private readonly todoListAccessService: TodoListAccessService,
  ) {}

  @Post('todo-item/:id/add')
  async addMemberToItem(
    @Req() req: WithAuthRequest,
    @Param('id') itemId: string,
    @Body() body: AddMembersDto,
  ) {
    return await this.todoItemAccessService.addMembers(
      req.user.sub,
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
    return await this.todoListAccessService.addMembers(
      req.user.sub,
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
    return this.todoListAccessService.removeMember(
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
    return this.todoItemAccessService.removeMember(
      +id,
      req.user.sub,
      +memberId,
    );
  }
}
