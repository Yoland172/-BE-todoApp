import { Inject, Injectable } from '@nestjs/common';
import {
  v2 as Cloudinary,
  UploadApiOptions,
  UploadApiResponse,
} from 'cloudinary';

@Injectable()
export class CloudinaryService {
  constructor(
    @Inject('CLOUDINARY') private readonly cloudinary: typeof Cloudinary,
  ) {}

  uploadBuffer(
    file: Express.Multer.File,
    opts: UploadApiOptions = {},
  ): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      const stream = this.cloudinary.uploader.upload_stream(
        { resource_type: 'auto', ...opts },
        (err, res) => (err ? reject(err) : resolve(res!)),
      );
      stream.end(file.buffer);
    });
  }

  async destroy(
    publicId: string,
    resource_type: 'image' | 'video' | 'raw',
  ): Promise<{ result: 'ok' | 'not_found' }> {
    return this.cloudinary.uploader.destroy(publicId, {
      type: 'authenticated',
      resource_type: resource_type,
    });
  }
}
