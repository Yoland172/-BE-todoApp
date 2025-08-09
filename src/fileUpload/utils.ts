export const inferResourceType = (mime: string): 'image' | 'video' | 'raw' => {
  if (mime.includes('video/')) return 'video';
  if (mime.includes('image/')) return 'image';
  return 'raw';
};
