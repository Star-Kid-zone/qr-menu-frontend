'use client';

import { Modal } from '@/components/Modal';
import type { PromptLightboxProps } from '../types';

export function PromptLightbox({ imageUrl, onClose }: PromptLightboxProps) {
  if (!imageUrl) return null;

  return (
    <Modal isOpen onClose={onClose} title="Reference picture" maxWidth="max-w-4xl">
      <div className="flex justify-center">
        {/* eslint-disable-next-line @next/next/no-img-element -- arbitrary external reference URLs */}
        <img src={imageUrl} alt="Reference picture, full size" className="max-h-[70vh] w-auto rounded-md object-contain" />
      </div>
    </Modal>
  );
}
