import { QR_LOGO_MAX_FILE_BYTES, QR_LOGO_MAX_PX } from '@/constants/qrCodes.constants';

/**
 * Reads an uploaded logo, centres it on a transparent square (so it is never
 * stretched in the QR's square slot) and shrinks it to at most 256 px.
 * Rejects non-images and very large files before decoding them.
 */
export async function readLogoFile(file: File): Promise<string> {
  if (!file.type.startsWith('image/')) {
    throw new Error('Choose an image file: PNG, JPG, WebP or SVG.');
  }
  if (file.size > QR_LOGO_MAX_FILE_BYTES) {
    throw new Error('That image is over 8 MB. Choose a smaller one.');
  }
  const url = URL.createObjectURL(file);
  try {
    const img = new Image();
    img.src = url;
    await img.decode();
    const w = img.naturalWidth || QR_LOGO_MAX_PX;
    const h = img.naturalHeight || QR_LOGO_MAX_PX;
    const side = Math.min(QR_LOGO_MAX_PX, Math.max(w, h));
    const scale = side / Math.max(w, h);
    const canvas = document.createElement('canvas');
    canvas.width = side;
    canvas.height = side;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error("Your browser couldn't read that image.");
    const dw = w * scale;
    const dh = h * scale;
    ctx.drawImage(img, (side - dw) / 2, (side - dh) / 2, dw, dh);
    return canvas.toDataURL('image/png');
  } catch (err) {
    if (err instanceof Error && err.message.startsWith('Your browser')) throw err;
    throw new Error("We couldn't read that image. Try a PNG or JPG.");
  } finally {
    URL.revokeObjectURL(url);
  }
}
