import { Inject, Injectable } from '@nestjs/common';
import {
  v2 as Cloudinary,
  UploadApiOptions,
  UploadApiResponse,
} from 'cloudinary';
import { inferResourceType } from './utils';

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
  ): Promise<{ result: 'ok' | 'not found' }> {
    return this.cloudinary.uploader.destroy(publicId, {
      type: 'private',
      resource_type: resource_type,
    });
  }

  async getPrivateDownloadUrl(
    publicId: string,
    contentType: string,
    isDownloadLink: boolean = false,
  ) {
    const [resource_type, format] = contentType.split('/');
    const expires_at = Math.floor(Date.now() / 1000) + 2 * 60; //NOTE: 10 minutes
    return await this.cloudinary.utils.private_download_url(publicId, format, {
      type: 'private',
      resource_type: inferResourceType(resource_type),
      expires_at,
      attachment: isDownloadLink,
    });
  }
}
