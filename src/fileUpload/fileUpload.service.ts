import { fileTypeFromBuffer } from 'file-type';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CloudinaryService } from './cloudinary.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Attachment, MimeTypeEnum } from 'src/entities/attachment.entity';
import { Repository } from 'typeorm';
import { TodoListService } from 'src/todo-list/todo-list.service';
import { inferResourceType } from './utils';

@Injectable()
export class FileUploadService {
  constructor(
    private readonly cloudinaryService: CloudinaryService,
    private readonly todoListService: TodoListService,
    @InjectRepository(Attachment)
    private readonly attachmentRepo: Repository<Attachment>,
  ) {}

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
      type: 'authenticated',
      use_filename: true,
    });

    const attachment = this.attachmentRepo.create({
      name: file.originalname,
      contentType: mime,
      sizeBytes: file.size,
      url: res.secure_url,
      assetId: res.asset_id,
      uploadedBy: { id: userId },
      todoList: { id: listId },
      duration: res.duration ?? null,
    });

    await this.attachmentRepo.save(attachment);

    return attachment;
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

    const { assetId } = item;

    const res = await this.cloudinaryService.destroy(
      assetId,
      inferResourceType(item.contentType),
    );

    if (res.result === 'not_found')
      throw new NotFoundException('not found any file');

    return 'file succesfuly deleted';
  }
}
