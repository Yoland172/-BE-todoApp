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
import { AttachTo, buildUploadOptions, inferResourceType } from './utils';
import { TodoItemService } from 'src/todo-item/todo-item.service';
import { UploadApiResponse } from 'cloudinary';

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
        { id: fileId, todoList: { createdBy: { id: userId } } },
        { id: fileId, todoList: { accessList: { userId: userId } } },
        { id: fileId, todoItem: { createdBy: { id: userId } } },
        { id: fileId, todoItem: { accessList: { userId: userId } } },
      ],
    });

    if (!file)
      throw new BadRequestException('user don`t have access or fileId invalid');

    return file;
  }

  async saveAttachmentInRepo(
    file: Express.Multer.File,
    cloudinaryRes: UploadApiResponse,
    propertyId: number,
    userId: number,
    mime: MimeTypeEnum,
    attachTo: AttachTo,
  ) {
    const attachment = this.attachmentRepo.create({
      name: file.originalname,
      contentType: mime,
      sizeBytes: file.size,
      publicId: cloudinaryRes.public_id,
      assetId: cloudinaryRes.asset_id,
      uploadedBy: { id: userId },
      ...(attachTo === AttachTo.LIST
        ? { todoList: { id: propertyId } }
        : { todoItem: { id: propertyId } }),
      thumbnail: cloudinaryRes.eager?.[0]?.url ?? null,
      duration: cloudinaryRes.duration ?? null,
    });

    await this.attachmentRepo.save(attachment);

    return attachment;
  }

  async getMime(buffer: Buffer<ArrayBufferLike>) {
    const detected = await fileTypeFromBuffer(buffer);

    if (!detected) throw new BadRequestException('Unknown format');

    const mime = detected.mime as MimeTypeEnum;

    if (!Object.values(MimeTypeEnum).includes(mime))
      throw new BadRequestException('Unsupported format');

    return mime;
  }

  async attachFileToList(
    userId: number,
    listId: number,
    file: Express.Multer.File,
  ) {
    await this.todoListService.findOne(listId, userId, true);

    const mime = await this.getMime(file.buffer);

    const opts = buildUploadOptions(file, listId, AttachTo.LIST);

    const res = await this.cloudinaryService.uploadBuffer(file, opts);

    return await this.saveAttachmentInRepo(
      file,
      res,
      listId,
      userId,
      mime,
      AttachTo.LIST,
    );
  }

  async attachFileToItem(
    userId: number,
    itemId: number,
    file: Express.Multer.File,
  ) {
    await this.todoItemService.findOne(itemId, userId, true);

    const mime = await this.getMime(file.buffer);

    const opts = buildUploadOptions(file, itemId, AttachTo.ITEM);

    const res = await this.cloudinaryService.uploadBuffer(file, opts);

    return await this.saveAttachmentInRepo(
      file,
      res,
      itemId,
      userId,
      mime,
      AttachTo.ITEM,
    );
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
    const file = await this.getFile(userId, fileId);

    if (!file) throw new NotFoundException('not found related items');

    const { publicId } = file;

    const res = await this.cloudinaryService.destroy(
      publicId,
      inferResourceType(file.contentType),
    );

    if (res.result === 'not found')
      throw new NotFoundException('not found any file');

    await this.attachmentRepo.delete(fileId);

    return { message: 'file deleted successfully' };
  }
}
