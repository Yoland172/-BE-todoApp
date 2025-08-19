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
import { PropertyAccessService } from './property-access.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { TodoItemAccessService } from './todo-item-access.service';

@UseGuards(JwtAuthGuard)
@Controller('property-access')
export class PropertyAccessController {
  constructor(
    private readonly propertyAccessService: PropertyAccessService,
    private readonly todoItemAccessService: TodoItemAccessService,
  ) {}

  // @Post('todo-item/:id/add')
  // async addMemberToItem(
  //   @Req() req: WithAuthRequest,
  //   @Param('id') itemId: string,
  //   @Body() body: AddMembersDto,
  // ) {
  //   return await this.todoItemAccessService.addMemberToItem(
  //     req.user.sub,
  //     +itemId,
  //     body,
  //   );
  // }

  // @Delete('todo-item/:id')
  // async removeMember(
  //   @Param('id') id: string,
  //   @Req() req: WithAuthRequest,
  //   @Query('memberId') memberId: string,
  // ) {
  //   return this.todoItemAccessService.removeMemberFromItem(
  //     +id,
  //     req.user.sub,
  //     +memberId,
  //   );
  // }
}
