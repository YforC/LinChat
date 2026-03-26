const JPEG_QUALITY = 0.9;

export function getCompatibleImageOutput(file = {}) {
  const extension = file.name?.split('.').pop()?.toLowerCase();
  const mimeType = (file.type || '').toLowerCase();

  if (mimeType === 'image/jpeg' || mimeType === 'image/jpg' || extension === 'jpg' || extension === 'jpeg') {
    return {
      mimeType: 'image/jpeg',
      extension: 'jpg',
      quality: JPEG_QUALITY,
    };
  }

  if (mimeType === 'image/webp' || extension === 'webp') {
    return {
      mimeType: 'image/png',
      extension: 'png',
      quality: undefined,
    };
  }

  return {
    mimeType: 'image/png',
    extension: 'png',
    quality: undefined,
  };
}
