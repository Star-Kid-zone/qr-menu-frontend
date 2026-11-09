"use client";

import React from "react";
import Image from "next/image";
import { Modal } from "@/components/Modal";
import { Card, EmptyState } from "@/components/ui";
import {
  PiImagesBold,
  PiEyeBold,
  PiCopyBold,
  PiArrowSquareOutBold,
} from "react-icons/pi";
import type { UserDetailResponse } from "../types";

interface UserGalleryTabProps {
  detail: UserDetailResponse;
  previewImage: string | null;
  setPreviewImage: (url: string | null) => void;
  copyToClipboard: (text: string, label: string) => void;
}

export function UserGalleryTab({
  detail,
  previewImage,
  setPreviewImage,
  copyToClipboard,
}: UserGalleryTabProps) {
  return (
    <div className="space-y-6 pb-8">
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border bg-card p-4">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <PiImagesBold className="size-5" />
          </div>
          <div>
            <h2 className="text-h3 font-bold text-foreground">
              Tenant Gallery Showcase
            </h2>
            <p className="text-xs text-muted-foreground">
              {detail.gallery?.length ?? 0} photos uploaded by this business
            </p>
          </div>
        </div>
      </div>

      {!detail.gallery || detail.gallery.length === 0 ? (
        <EmptyState
          icon={<PiImagesBold className="size-8" />}
          title="No Gallery Images"
          description="This business has not uploaded any photos to their showcase gallery yet."
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {detail.gallery.map((img) => (
            <Card
              key={img.id}
              className="group relative flex flex-col overflow-hidden transition-all hover:border-primary/40 hover:shadow-lg"
            >
              <div
                className="relative h-48 w-full cursor-pointer bg-muted overflow-hidden"
                onClick={() => setPreviewImage(img.imageUrl)}
              >
                <Image
                  src={img.imageUrl}
                  alt="Gallery item"
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  unoptimized
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity group-hover:opacity-100 flex items-center justify-center">
                  <span className="rounded-full bg-white/20 p-2 text-white backdrop-blur-sm">
                    <PiEyeBold size={20} />
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-card border-t border-border">
                <span className="font-mono text-caption text-muted-foreground">
                  Photo #{img.id}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => copyToClipboard(img.imageUrl, "Image URL")}
                    className="rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
                    title="Copy Image URL"
                  >
                    <PiCopyBold size={13} />
                  </button>
                  <a
                    href={img.imageUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-primary"
                    title="Open original image"
                  >
                    <PiArrowSquareOutBold size={13} />
                  </a>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal
        isOpen={Boolean(previewImage)}
        onClose={() => setPreviewImage(null)}
        title="Photo preview"
        maxWidth="max-w-5xl"
      >
        {previewImage && (
          <div className="flex justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={previewImage}
              alt="Gallery photo, full size"
              className="max-h-[70vh] w-auto rounded-md object-contain"
            />
          </div>
        )}
      </Modal>
    </div>
  );
}
