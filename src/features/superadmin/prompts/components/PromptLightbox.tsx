'use client';

import { PiXBold } from 'react-icons/pi';
import type { PromptLightboxProps } from '../types';

export function PromptLightbox({ imageUrl, onClose }: PromptLightboxProps) {
  if (!imageUrl) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md cursor-pointer animate-in fade-in"
    >
      <div className="relative max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl border border-white/20 shadow-2xl">
        <img
          src={imageUrl}
          alt="Reference Preview"
          className="max-h-[85vh] w-auto object-contain rounded-xl"
        />
        <button
          onClick={onClose}
          className="absolute top-3 right-3 rounded-full bg-black/70 p-2 text-white hover:bg-black transition-all"
        >
          <PiXBold className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
