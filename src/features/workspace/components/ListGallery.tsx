'use client';
import { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import Image from '@/components/ui/Image';
import { workspaceService, type WorkspaceGalleryItem } from '@/services/workspace.service';
import { compressImageFile } from '@/utils/imageCompressor';
import { toast } from "@/components/ui/toast";
import { Modal } from '@/components/Modal';
import {
  PiImageBold,
  PiTrashBold,
  PiUploadSimpleBold,
} from 'react-icons/pi';
import { usePagination } from '@/hooks/usePagination';
import { Pagination } from '@/components/ui/Pagination';
import { getApiErrorMessage } from "@/utils/errors";

export interface ListGalleryHandle {
  openUpload: () => void;
}

export interface ListGalleryProps {
  embedded?: boolean;
  initialImages?: WorkspaceGalleryItem[];
  onChanged?: () => void | Promise<void>;
}

export const ListGallery = forwardRef<ListGalleryHandle, ListGalleryProps>(({
  embedded = false,
  initialImages,
  onChanged,
}, ref) => {
  const [images, setImages] = useState<WorkspaceGalleryItem[]>(initialImages ?? []);
  const [uploading, setUploading] = useState(false);
  const [imageIdToDelete, setImageIdToDelete] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useImperativeHandle(ref, () => ({
    openUpload: () => fileInputRef.current?.click(),
  }));

  const { page, pageCount, pageItems, pageSize, totalItems, setPage } = usePagination(images, 8);

  useEffect(() => {
    if (initialImages) setImages(initialImages);
  }, [initialImages]);

  const refresh = async () => {
    if (onChanged) await onChanged();
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image is too large. Max size is 5MB.');
      return;
    }

    try {
      setUploading(true);
      const fileToUpload = await compressImageFile(file);
      const formData = new FormData();
      formData.append('image', fileToUpload as Blob);
      await workspaceService.addGalleryItem(formData);
      toast.success('Image uploaded successfully!');
      await refresh();
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Failed to upload image.'));
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await workspaceService.removeGalleryItem(id);
      toast.success('Image deleted.');
      setImageIdToDelete(null);
      await refresh();
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Failed to delete image.'));
    }
  };

  const grid = images.length === 0 ? (
    <div className="rounded-lg border-2 border-dashed border-border p-12 text-center">
      <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-muted text-4xl text-muted-foreground">
        <PiImageBold />
      </div>
      <h3 className="mb-2 text-h3 text-foreground">No Images Yet</h3>
      <p className="mx-auto max-w-sm text-body text-muted-foreground">
        Upload your best photos to create a beautiful gallery on your landing page.
      </p>
    </div>
  ) : (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {(embedded ? pageItems : images).map((img) => (
        <div
          key={img.id}
          className="group relative overflow-hidden rounded-lg border border-border bg-card transition-shadow hover:shadow-md"
        >
          <div className="relative aspect-[4/3] w-full bg-muted">
            <Image
              src={img.imageUrl}
              fill
              className="object-cover transition-all duration-500"
              alt="Gallery image"
            />

            <div className="absolute inset-0 flex items-center justify-center gap-3 bg-foreground/50 opacity-0 transition-opacity group-hover:opacity-100">
              <button
                onClick={() => setImageIdToDelete(img.id)}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/20 text-background backdrop-blur-sm transition-colors hover:bg-destructive"
                title="Delete Image"
              >
                <PiTrashBold />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className={embedded ? 'flex h-full flex-col gap-4' : 'mx-auto max-w-7xl space-y-8 p-6 md:p-8'}>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept="image/*"
        className="hidden"
      />
      {!embedded && (
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-display flex items-center gap-3 text-foreground">
              <span className="rounded-lg bg-primary/10 p-2 text-primary">
                <PiImageBold />
              </span>
              Website Gallery
            </h1>
            <p className="mt-2 text-body text-muted-foreground">
              Upload ambiance shots and food photography to showcase on your landing page.
            </p>
          </div>
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className={`flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground transition-colors ${
              uploading ? 'cursor-not-allowed opacity-70' : 'hover:bg-primary/90'
            }`}
          >
            {uploading ? (
              <div className="h-5 w-5 animate-spin rounded-full border-b-2 border-primary-foreground"></div>
            ) : (
              <PiUploadSimpleBold className="text-xl" />
            )}
            {uploading ? 'Uploading...' : 'Upload Image'}
          </button>
        </div>
      )}

      <div className={embedded ? 'min-h-0 flex-1 overflow-y-auto pr-1' : ''}>{grid}</div>

      {embedded ? (
        <div className="shrink-0">
          <Pagination page={page} pageCount={pageCount} onPageChange={setPage} totalItems={totalItems} pageSize={pageSize} />
        </div>
      ) : null}

      <Modal
        isOpen={imageIdToDelete !== null}
        onClose={() => setImageIdToDelete(null)}
        title="Delete Image"
        maxWidth="max-w-md"
        footer={
          <>
            <button
              type="button"
              onClick={() => setImageIdToDelete(null)}
              className="rounded-lg border border-border px-4 py-2 transition-colors hover:bg-muted"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => imageIdToDelete !== null && handleDelete(imageIdToDelete)}
              className="rounded-lg bg-destructive px-4 py-2 text-destructive-foreground transition-colors hover:bg-destructive/90"
            >
              Delete
            </button>
          </>
        }
      >
        <p className="text-sm text-muted-foreground">
          Are you sure you want to delete this image? This action cannot be undone.
        </p>
      </Modal>
    </div>
  );
});

ListGallery.displayName = 'ListGallery';
