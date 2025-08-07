import {
  BadRequestException,
  Controller,
  Delete,
  Param,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { memoryStorage } from 'multer';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { WithAuthRequest } from 'src/lib/types/requests';
import { FileUploadService } from './fileUpload.service';

@Controller('files')
@UseGuards(JwtAuthGuard)
export class CloudinaryController {
  constructor(private readonly fileUploadService: FileUploadService) {}

  @Post('todoList/:id/upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: { fileSize: 10 * 1024 * 1024 },
    }),
  )
  async todoListUpload(
    @Req() req: WithAuthRequest,
    @Param('id') listId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) throw new BadRequestException('file is required');

    return await this.fileUploadService.attachFileToList(
      req.user.sub,
      +listId,
      file,
    );
  }

  @Delete(':id')
  async deleteAttachedFile(
    @Req() req: WithAuthRequest,
    @Param('id') id: string,
  ) {
    return await this.fileUploadService.deleteFileFromList(req.user.sub, +id);
  }
}
