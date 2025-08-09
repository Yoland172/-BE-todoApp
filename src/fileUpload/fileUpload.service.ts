import { fileTypeFromBuffer } from 'file-type';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CloudinaryService } from './cloudinary.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Attachment, MimeTypeEnum } from 'src/entities/attachment.entity';
import { Repository } from 'typeorm';
import { TodoListService } from 'src/todo-list/todo-list.service';
import { inferResourceType } from './utils';
import { TodoItemService } from 'src/todo-item/todo-item.service';
import { isNumber } from 'class-validator';
import TodoList from 'src/entities/todoList.entity';
import { TodoItem } from 'src/entities/todoItem.entity';

@Injectable()
export class FileUploadService {
  constructor(
    private readonly cloudinaryService: CloudinaryService,
    private readonly todoListService: TodoListService,
    private readonly todoItemService: TodoItemService,
    @InjectRepository(Attachment)
    private readonly attachmentRepo: Repository<Attachment>,
  ) {}

  async getFile(userId: number, fileId: number) {
    const file = await this.attachmentRepo.findOne({
      where: [
        { uploadedBy: { id: userId }, id: fileId },
        { id: fileId, todoList: { owner: { id: userId } } },
        { id: fileId, todoList: { shares: { user: { id: userId } } } },
        { id: fileId, todoItem: { createdBy: { id: userId } } },
        { id: fileId, todoList: { shares: { user: { id: userId } } } },
      ],
    });

    if (!file)
      throw new BadRequestException('user don`t have access or fileId invalid');

    return file;
  }

  async attachFileToList(
    userId: number,
    listId: number,
    file: Express.Multer.File,
  ) {
    await this.todoListService.findOne(listId, userId);

    const detected = await fileTypeFromBuffer(file.buffer);

    if (!detected) throw new BadRequestException('Unknown format');

    const mime = detected.mime as MimeTypeEnum;

    if (!Object.values(MimeTypeEnum).includes(mime))
      throw new BadRequestException('Unsupported format');

    const folder = `list/${listId}`;
    const res = await this.cloudinaryService.uploadBuffer(file, {
      folder,
      type: 'private',
      eager: [
        { width: 200, height: 200, crop: 'fill', gravity: 'auto' }, // thumbnail 200×200
      ],
      eager_async: true,
    });

    console.log(res);

    const attachment = this.attachmentRepo.create({
      name: file.originalname,
      contentType: mime,
      sizeBytes: file.size,
      publicId: res.public_id,
      assetId: res.asset_id,
      uploadedBy: { id: userId },
      todoList: { id: listId },
      thumbnail: res.eager[0].url,
      duration: res.duration ?? null,
    });

    await this.attachmentRepo.save(attachment);

    return attachment;
  }

  async generateLinkToDownload(
    userId: number,
    fileId: number,
    isDownloadLink: boolean,
  ) {
    const file = await this.getFile(userId, fileId);

    const link = await this.cloudinaryService.getPrivateDownloadUrl(
      file.publicId,
      file.contentType,
      isDownloadLink,
    );

    return link;
  }

  async deleteFileFromList(userId: number, fileId: number) {
    const item = await this.attachmentRepo.findOne({
      where: {
        id: fileId,
        todoList: [
          {
            owner: { id: userId },
          },
          { shares: { user: { id: userId } } },
        ],
      },
    });

    if (!item) throw new NotFoundException('not found related items');

    const { publicId } = item;

    const res = await this.cloudinaryService.destroy(
      publicId,
      inferResourceType(item.contentType),
    );

    if (res.result === 'not found')
      throw new NotFoundException('not found any file');

    await this.attachmentRepo.delete(fileId);

    return { message: 'file deleted successfully' };
  }
}
