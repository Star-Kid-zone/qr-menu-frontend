import { describe, expect, it } from 'vitest';
import { isOptimizableImageSrc } from './imageHosts';

describe('isOptimizableImageSrc', () => {
  it('accepts local paths and allow-listed hosts', () => {
    expect(isOptimizableImageSrc('/images/logo.png')).toBe(true);
    expect(isOptimizableImageSrc('https://images.unsplash.com/photo-1')).toBe(true);
    expect(isOptimizableImageSrc('https://www.themealdb.com/a.jpg')).toBe(true);
    expect(isOptimizableImageSrc('https://my-bucket.s3.ap-south-1.amazonaws.com/x.jpg')).toBe(true);
    expect(isOptimizableImageSrc('http://localhost:5000/uploads/x.jpg')).toBe(true);
  });

  it('rejects unknown hosts, wrong protocols and non-http sources', () => {
    expect(isOptimizableImageSrc('https://cdn.example.com/banner/new.jpg')).toBe(false);
    expect(isOptimizableImageSrc('http://images.unsplash.com/photo-1')).toBe(false);
    expect(isOptimizableImageSrc('https://evil.com/images.unsplash.com')).toBe(false);
    expect(isOptimizableImageSrc('https://a.b.s3.x.amazonaws.com/x.jpg')).toBe(false);
    expect(isOptimizableImageSrc('//cdn.example.com/x.jpg')).toBe(false);
    expect(isOptimizableImageSrc('blob:http://localhost:3000/abc')).toBe(false);
    expect(isOptimizableImageSrc('data:image/png;base64,AAAA')).toBe(false);
    expect(isOptimizableImageSrc('not a url')).toBe(false);
  });
});
