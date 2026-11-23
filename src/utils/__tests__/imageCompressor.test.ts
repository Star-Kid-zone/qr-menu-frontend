import { describe, it, expect, vi, beforeEach } from 'vitest';
import { compressImageFile } from '../imageCompressor';

describe('compressImageFile', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('returns non-image files untouched', async () => {
    const file = new File(['hello world'], 'test.txt', { type: 'text/plain' });
    const result = await compressImageFile(file);
    expect(result).toBe(file);
  });

  it('skips SVG files untouched to preserve vector quality', async () => {
    const file = new File(['<svg></svg>'], 'icon.svg', { type: 'image/svg+xml' });
    const result = await compressImageFile(file);
    expect(result).toBe(file);
  });

  it('skips GIF files untouched to avoid stripping animation frames', async () => {
    const file = new File(['GIF89a'], 'anim.gif', { type: 'image/gif' });
    const result = await compressImageFile(file);
    expect(result).toBe(file);
  });

  it('returns file untouched if canvas 2D context is unavailable', async () => {
    const file = new File(['fake-jpg-data'], 'photo.jpg', { type: 'image/jpeg' });
    const mockBitmap = {
      width: 1000,
      height: 800,
      close: vi.fn(),
    };
    vi.stubGlobal('createImageBitmap', vi.fn().mockResolvedValue(mockBitmap));

    vi.spyOn(document, 'createElement').mockImplementation((tagName: string) => {
      if (tagName === 'canvas') {
        return {
          getContext: () => null,
          width: 0,
          height: 0,
        } as unknown as HTMLCanvasElement;
      }
      return document.createElement(tagName);
    });

    const result = await compressImageFile(file);
    expect(result).toBe(file);
    expect(mockBitmap.close).toHaveBeenCalled();
  });

  it('compresses and returns a smaller File when canvas compression succeeds', async () => {
    const largeData = new Uint8Array(2048);
    const file = new File([largeData], 'large.jpg', { type: 'image/jpeg' });

    // Mock createImageBitmap
    const mockBitmap = {
      width: 3840,
      height: 2160,
      close: vi.fn(),
    };
    vi.stubGlobal('createImageBitmap', vi.fn().mockResolvedValue(mockBitmap));

    // Mock canvas and 2D context
    const smallerBlob = new Blob([new Uint8Array(512)], { type: 'image/jpeg' });
    const mockCtx = {
      drawImage: vi.fn(),
    };
    const mockCanvas = {
      width: 0,
      height: 0,
      getContext: vi.fn().mockReturnValue(mockCtx),
      toBlob: vi.fn((callback: (b: Blob | null) => void) => callback(smallerBlob)),
    };
    vi.spyOn(document, 'createElement').mockImplementation((tagName: string) => {
      if (tagName === 'canvas') {
        return mockCanvas as unknown as HTMLCanvasElement;
      }
      return document.createElement(tagName);
    });

    const result = await compressImageFile(file, { maxWidth: 1920, maxHeight: 1080 });
    expect(result).not.toBe(file);
    expect(result.name).toBe('large.jpg');
    expect(result.size).toBe(512);
    expect(mockCanvas.width).toBe(1920);
    expect(mockCanvas.height).toBe(1080);
    expect(mockBitmap.close).toHaveBeenCalled();
  });

  it('keeps original file if compression result is larger than original', async () => {
    const file = new File([new Uint8Array(200)], 'small.jpg', { type: 'image/jpeg' });

    const mockBitmap = {
      width: 500,
      height: 400,
      close: vi.fn(),
    };
    vi.stubGlobal('createImageBitmap', vi.fn().mockResolvedValue(mockBitmap));

    const largerBlob = new Blob([new Uint8Array(500)], { type: 'image/jpeg' });
    const mockCanvas = {
      width: 0,
      height: 0,
      getContext: vi.fn().mockReturnValue({ drawImage: vi.fn() }),
      toBlob: vi.fn((callback: (b: Blob | null) => void) => callback(largerBlob)),
    };
    vi.spyOn(document, 'createElement').mockImplementation((tagName: string) => {
      if (tagName === 'canvas') return mockCanvas as unknown as HTMLCanvasElement;
      return document.createElement(tagName);
    });

    const result = await compressImageFile(file);
    expect(result).toBe(file);
  });

  it('catches any internal error and safely returns original file', async () => {
    const file = new File(['data'], 'error.jpg', { type: 'image/jpeg' });
    const mockBitmap = {
      width: 1000,
      height: 800,
      close: vi.fn(),
    };
    vi.stubGlobal('createImageBitmap', vi.fn().mockResolvedValue(mockBitmap));

    const mockCanvas = {
      width: 0,
      height: 0,
      getContext: vi.fn().mockReturnValue({
        drawImage: () => {
          throw new Error('Canvas render failed');
        },
      }),
      toBlob: vi.fn(),
    };
    vi.spyOn(document, 'createElement').mockImplementation((tagName: string) => {
      if (tagName === 'canvas') return mockCanvas as unknown as HTMLCanvasElement;
      return document.createElement(tagName);
    });

    const result = await compressImageFile(file);
    expect(result).toBe(file);
  });
});
