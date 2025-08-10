import { UploadApiOptions } from 'cloudinary';
import path from 'path';

export const inferResourceType = (mime: string): 'image' | 'video' | 'raw' => {
  if (mime.includes('video')) return 'video';
  if (mime.includes('image')) return 'image';
  return 'raw';
};

export const buildUploadOptions = (
  file: Express.Multer.File,
  propertyId: number,
  attachTo: AttachTo,
): UploadApiOptions => {
  console.log(file);
  const [top, format] = file.mimetype.split('/'); // image | video | audio | application | ...
  const resource_type =
    top === 'image'
      ? 'image'
      : top === 'video' || top === 'audio'
        ? 'video'
        : 'raw';

  const base: UploadApiOptions = {
    folder: `${attachTo}/${propertyId}`,
    type: 'private',
    filename_override: file.originalname,
    format,
    resource_type,
    use_filename: true,
    unique_filename: true,
    overwrite: false,
    context: { mime: file.mimetype },
  };

  if (resource_type === 'image') {
    base.eager = [
      {
        format: 'webp',
        width: 400,
        height: 250,
        crop: 'fill',
        gravity: 'auto',
        quality: 'auto:good',
      },
    ];
  } else if (resource_type === 'video') {
    base.eager = [
      {
        // постер із відео (кадр) у JPG/WebP
        format: 'webp', // або 'webp'
        start_offset: 'auto',
        width: 400,
        height: 250,
        crop: 'fill',
        gravity: 'auto',
        quality: 'auto:good',
      },
    ];
    base.eager_async = true; // щоб не чекати генерацію постера
  } else {
    // raw (pdf/zip/docx/…): прев’ю через eager не робимо
    // за потреби просто збережемо як є
  }

  return base;
};

function normalize(ext: string): string {
  if (ext === 'jpeg') return 'jpg';
  if (ext === 'svg+xml') return 'svg';
  return ext;
}

export const pickFormat = (file: Express.Multer.File): string => {
  // 1) спробувати взяти з імені файла
  const ext = path
    .extname(file.originalname || '')
    .slice(1)
    .toLowerCase();
  if (ext) return normalize(ext);

  // 2) fallback за MIME
  const map: Record<string, string> = {
    'application/pdf': 'pdf',
    'application/zip': 'zip',
    'application/x-zip-compressed': 'zip',
    'application/msword': 'doc',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
      'docx',
  };
  return map[file.mimetype] || 'bin';
};

export enum AttachTo {
  LIST = 'list',
  ITEM = 'item',
}
