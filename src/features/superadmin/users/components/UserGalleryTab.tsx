"use client";

import React from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Card, EmptyState } from "@/shared/components";
import {
  PiImagesBold,
  PiEyeBold,
  PiCopyBold,
  PiArrowSquareOutBold,
  PiXBold,
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
                <span className="font-mono text-[11px] text-muted-foreground">
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

      {/* Fullscreen Lightbox Modal */}
      <AnimatePresence>
        {previewImage && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md"
            onClick={() => setPreviewImage(null)}
          >
            <motion.div
              className="relative max-h-[90vh] max-w-[90vw] overflow-hidden rounded-2xl border border-white/20 bg-card shadow-2xl"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setPreviewImage(null)}
                className="absolute right-4 top-4 z-10 rounded-full bg-black/60 p-2 text-white hover:bg-black"
              >
                <PiXBold size={18} />
              </button>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={previewImage}
                alt="Full preview"
                className="max-h-[85vh] max-w-[85vw] object-contain"
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
