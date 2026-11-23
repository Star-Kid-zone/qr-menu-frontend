import { IMAGE_COMPRESSION_DEFAULTS } from '@/constants/app.constants';
import type { ImageCompressionOptions } from '@/types/shared/common.types';

/**
 * Client-side image pre-compression.
 * Resizes oversized images (e.g., modern smartphone photos) and re-encodes
 * with high quality compression before uploading to save user bandwidth and upload time.
 * Gracefully falls back to the original file in SSR, simulated test DOMs, or unsupported environments.
 */
export async function compressImageFile(
  file: File,
  options?: ImageCompressionOptions
): Promise<File> {
  // SSR or unsupported environment guard
  if (
    typeof window === 'undefined' ||
    typeof document === 'undefined' ||
    !document.createElement
  ) {
    return file;
  }

  // In automated test environments (happy-dom / jsdom), DOM image loading is not implemented
  // unless explicitly mocked in the test via vi.fn().
  const isSimulatedDom =
    typeof navigator !== 'undefined' &&
    /happy-?dom|jsdom/i.test(navigator.userAgent);

  const hasMockedBitmap =
    typeof window.createImageBitmap === 'function' &&
    'mock' in window.createImageBitmap;

  if (isSimulatedDom && !hasMockedBitmap) {
    return file;
  }

  // Only process standard rasters (skip SVGs, animated GIFs, or non-images)
  if (
    !file.type.startsWith('image/') ||
    file.type === 'image/svg+xml' ||
    file.type === 'image/gif'
  ) {
    return file;
  }

  const maxWidth = options?.maxWidth ?? IMAGE_COMPRESSION_DEFAULTS.maxWidth;
  const maxHeight = options?.maxHeight ?? IMAGE_COMPRESSION_DEFAULTS.maxHeight;
  const quality = options?.quality ?? IMAGE_COMPRESSION_DEFAULTS.quality;
  const maxSizeBytes = options?.maxSizeBytes ?? IMAGE_COMPRESSION_DEFAULTS.maxSizeBytes;
  const targetMime = options?.mimeType ?? file.type;

  try {
    let sourceWidth = 0;
    let sourceHeight = 0;
    let drawable: ImageBitmap | HTMLImageElement | null = null;

    if (typeof window.createImageBitmap === 'function') {
      try {
        const bitmap = await window.createImageBitmap(file);
        sourceWidth = bitmap.width;
        sourceHeight = bitmap.height;
        drawable = bitmap;
      } catch {
        // Fallback to Image element if createImageBitmap fails
      }
    }

    if (!drawable && typeof Image !== 'undefined') {
      drawable = await new Promise<HTMLImageElement>((resolve, reject) => {
        const img = new Image();
        const url = URL.createObjectURL(file);
        const timer = setTimeout(() => {
          try {
            URL.revokeObjectURL(url);
          } catch {}
          reject(new Error('Image decode timeout'));
        }, 2000);

        img.onload = () => {
          clearTimeout(timer);
          try {
            URL.revokeObjectURL(url);
          } catch {}
          resolve(img);
        };
        img.onerror = (err) => {
          clearTimeout(timer);
          try {
            URL.revokeObjectURL(url);
          } catch {}
          reject(err);
        };
        img.src = url;
      });
      sourceWidth = drawable.width;
      sourceHeight = drawable.height;
    }

    if (!drawable || sourceWidth === 0 || sourceHeight === 0) {
      if (drawable && 'close' in drawable && typeof drawable.close === 'function') {
        drawable.close();
      }
      return file;
    }

    // Determine target dimensions
    let targetWidth = sourceWidth;
    let targetHeight = sourceHeight;

    if (targetWidth > maxWidth || targetHeight > maxHeight) {
      const ratio = Math.min(maxWidth / targetWidth, maxHeight / targetHeight);
      targetWidth = Math.max(1, Math.round(targetWidth * ratio));
      targetHeight = Math.max(1, Math.round(targetHeight * ratio));
    }

    // If within bounds and already sufficiently small, skip re-encoding
    if (
      targetWidth === sourceWidth &&
      targetHeight === sourceHeight &&
      file.size <= maxSizeBytes
    ) {
      if ('close' in drawable && typeof drawable.close === 'function') {
        drawable.close();
      }
      return file;
    }

    const canvas = document.createElement('canvas');
    canvas.width = targetWidth;
    canvas.height = targetHeight;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      if ('close' in drawable && typeof drawable.close === 'function') {
        drawable.close();
      }
      return file;
    }

    ctx.drawImage(drawable, 0, 0, targetWidth, targetHeight);

    if ('close' in drawable && typeof drawable.close === 'function') {
      drawable.close();
    }

    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob(resolve, targetMime, quality);
    });

    // If compression failed or compressed output is actually larger, keep original
    if (!blob || blob.size >= file.size) {
      return file;
    }

    return new File([blob], file.name, {
      type: blob.type || targetMime,
      lastModified: Date.now(),
    });
  } catch {
    // Fail-safe: return the original file on any unexpected error
    return file;
  }
}
