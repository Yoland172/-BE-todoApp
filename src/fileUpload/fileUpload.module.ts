import { Module } from '@nestjs/common';
import { CloudinaryService } from './cloudinary.service';
import { CloudinaryController } from './fileUpload.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { v2 as cloudinary, ConfigOptions } from 'cloudinary';
import { AuthModule } from 'src/auth/auth.module';
import { FileUploadService } from './fileUpload.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Attachment } from 'src/entities/attachment.entity';
import { TodoListModule } from 'src/todo-list/todo-list.module';
import { TodoItemModule } from 'src/todo-item/todo-item.module';

@Module({
  imports: [
    AuthModule,
    ConfigModule,
    TypeOrmModule.forFeature([Attachment]),
    TodoListModule,
    TodoItemModule,
  ],
  controllers: [CloudinaryController],
  providers: [
    CloudinaryService,
    FileUploadService,
    {
      provide: 'CLOUDINARY',
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => {
        const options: ConfigOptions = {
          cloud_name: cfg.get<string>('CLOUDINARY_CLOUD_NAME'),
          api_key: cfg.get<string>('CLOUDINARY_API_KEY'),
          api_secret: cfg.get<string>('CLOUDINARY_API_SECRET'),
          secure: true,
        };
        cloudinary.config(options);
        return cloudinary;
      },
    },
  ],
  exports: ['CLOUDINARY', CloudinaryService],
})
export class CloudinaryModule {}
