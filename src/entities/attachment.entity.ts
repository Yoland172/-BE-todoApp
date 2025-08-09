import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseDateEntity } from './utils/base-date.entity';
import User from './user.entity';
import { TodoItem } from './todoItem.entity';
import TodoList from './todoList.entity';

// src/files/mime-type.enum.ts
export enum MimeTypeEnum {
  /* ---------- Images ---------- */
  ImageJpeg = 'image/jpeg',
  ImagePng = 'image/png',
  ImageGif = 'image/gif',
  ImageWebp = 'image/webp',
  ImageApng = 'image/apng',
  ImageAvif = 'image/avif',
  ImageHeic = 'image/heic',
  ImageHeif = 'image/heif',
  ImageTiff = 'image/tiff',
  ImageBmp = 'image/bmp',
  ImageIco = 'image/x-icon',

  /* ---------- Archives ---------- */
  ApplicationZip = 'application/zip',
  ApplicationSevenZ = 'application/x-7z-compressed',
  ApplicationRar = 'application/x-rar-compressed',
  ApplicationTar = 'application/x-tar',
  ApplicationGzip = 'application/gzip',
  ApplicationBzip2 = 'application/x-bzip2',
  ApplicationZstd = 'application/x-zstd', // .zst

  /* ---------- Documents ---------- */
  ApplicationPdf = 'application/pdf',
  ApplicationMsword = 'application/msword', // .doc
  ApplicationDocx = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ApplicationXls = 'application/vnd.ms-excel',
  ApplicationXlsx = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  ApplicationPpt = 'application/vnd.ms-powerpoint',
  ApplicationPptx = 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  ApplicationRtf = 'application/rtf',
  ApplicationOdt = 'application/vnd.oasis.opendocument.text',
  ApplicationOds = 'application/vnd.oasis.opendocument.spreadsheet',

  /* ---------- Video ---------- */
  VideoMp4 = 'video/mp4',
  VideoWebm = 'video/webm',
  VideoMov = 'video/quicktime',
  VideoAvi = 'video/x-msvideo',
  VideoMkv = 'video/x-matroska',
  VideoMpeg = 'video/mpeg',
}

@Entity()
export class Attachment extends BaseDateEntity {
  @Column()
  name: string;

  @Column()
  contentType: MimeTypeEnum;

  @Column()
  sizeBytes: number;

  @Column()
  publicId: string;

  @Column()
  assetId: string;

  @Column({ nullable: true })
  thumbnail: string | null;

  @Column({ type: 'float8', nullable: true })
  duration?: number | null;

  @ManyToOne(() => User, (user) => user.attachments)
  uploadedBy: User;

  @ManyToOne(() => TodoItem, (todoItem) => todoItem.attachments, {
    nullable: true,
  })
  todoItem: TodoItem | null;

  @ManyToOne(() => TodoList, (todoList) => todoList.attachments, {
    nullable: true,
  })
  todoList: TodoList | null;
}
