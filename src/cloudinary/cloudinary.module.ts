import { Module } from '@nestjs/common';
import { CloudinaryService } from './cloudinary.service';
import { CloudinaryController } from './cloudinary.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { v2 as cloudinary, ConfigOptions } from 'cloudinary';

@Module({
  imports: [ConfigModule],
  controllers: [CloudinaryController],
  providers: [
    CloudinaryService,
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
