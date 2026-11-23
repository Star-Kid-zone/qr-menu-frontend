"use client";

import Image from "@/components/ui/Image";
import { useEffect, useRef, useState } from "react";
import { PiArrowCounterClockwiseBold, PiCheckBold, PiUploadSimpleBold } from "react-icons/pi";
import { Button, Spinner, toast } from "@/components/ui";
import { cn } from "@/utils/cn";
import { workspaceService } from "@/services/workspace.service";
import { getApiErrorMessage } from "@/utils/errors";
import { compressImageFile } from "@/utils/imageCompressor";

/**
 * Built-in photos (public/landing/<set>/hero.*), hand-picked: only ones that
 * actually show food or a dining room, labelled by what they show.
 */
import { STOCK_HERO_PHOTOS, HERO_IMAGE_UPLOAD } from "@/constants/workspace.constants";

export { STOCK_HERO_PHOTOS };

export interface HeroImagePanelProps {
  disabled: boolean;
  /** Called after the hero photo changes (it's saved straight away), so the page/preview reloads. */
  onChanged?: () => void | Promise<void>;
}

function Thumb({ url, label, selected, disabled, onPick }: { url: string; label: string; selected: boolean; disabled: boolean; onPick: () => void }) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      aria-label={label}
      title={label}
      disabled={disabled}
      onClick={onPick}
      className={cn(
        "relative aspect-[4/3] overflow-hidden rounded-lg border focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-60",
        selected ? "border-primary ring-2 ring-primary" : "border-border hover:border-primary/50"
      )}
    >
      <Image src={url} alt="" fill sizes="160px" className="object-cover" />
      {selected ? (
        <span className="absolute right-1 top-1 rounded-full bg-primary p-0.5 text-primary-foreground">
          <PiCheckBold className="size-3" aria-hidden />
        </span>
      ) : null}
    </button>
  );
}

/**
 * Hero image: upload a photo, or pick one of your gallery photos or a built-in
 * photo, or go back to the style's own photo. Saved straight away (it's a file,
 * not a setting), then the preview reloads.
 */
export function HeroImagePanel({ disabled, onChanged }: HeroImagePanelProps) {
  const [current, setCurrent] = useState<string | null | undefined>(undefined);
  const [gallery, setGallery] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let cancelled = false;
    workspaceService
      .getWorkspace()
      .then((res) => {
        if (cancelled) return;
        setCurrent(res.data.theme?.bannerUrl ?? null);
        setGallery((res.data.gallery ?? []).map((g) => g.imageUrl).filter(Boolean));
      })
      .catch((err) => {
        if (!cancelled) setError(getApiErrorMessage(err, "Couldn't load your photos."));
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const done = async (url: string | null) => {
    setCurrent(url);
    setError(null);
    toast.success("Hero photo updated.");
    await onChanged?.();
  };

  const choose = async (url: string | null) => {
    setBusy(true);
    setError(null);
    try {
      await workspaceService.chooseHeroImage(url);
      await done(url);
    } catch (err) {
      setError(getApiErrorMessage(err, "Couldn't change the photo."));
    } finally {
      setBusy(false);
    }
  };

  const upload = async (file: File) => {
    if (!HERO_IMAGE_UPLOAD.ACCEPT.split(",").includes(file.type)) return setError("Use a JPG, PNG or WebP photo.");
    if (file.size > HERO_IMAGE_UPLOAD.MAX_MB * 1024 * 1024) return setError(`Use a photo under ${HERO_IMAGE_UPLOAD.MAX_MB} MB.`);
    setBusy(true);
    setError(null);
    try {
      const fileToUpload = await compressImageFile(file);
      const form = new FormData();
      form.append("image", fileToUpload);
      const res = await workspaceService.uploadHeroImage(form);
      await done(res.data.url);
    } catch (err) {
      setError(getApiErrorMessage(err, "Couldn't upload the photo."));
    } finally {
      setBusy(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const locked = disabled || busy;

  return (
    <section aria-labelledby="hero-photo-heading" className="space-y-4">
      <div className="flex flex-wrap items-start gap-4">
        <div className="relative aspect-[16/9] w-full max-w-xs overflow-hidden rounded-lg border border-border bg-muted">
          {current === undefined ? (
            <div className="grid h-full place-items-center"><Spinner size="sm" /></div>
          ) : current ? (
            <Image src={current} alt="Current hero photo" fill sizes="320px" className="object-cover" />
          ) : (
            <p className="grid h-full place-items-center px-4 text-center text-caption text-muted-foreground">Using your style&apos;s own photo</p>
          )}
          {busy ? <div className="absolute inset-0 grid place-items-center bg-background/60"><Spinner size="sm" /></div> : null}
        </div>
        <div className="min-w-0 flex-1 space-y-2">
          <h3 id="hero-photo-heading" className="text-body-medium text-foreground">Hero photo</h3>
          <p className="text-caption text-muted-foreground">
            The big photo at the top of your page. A wide, bright photo of your best dish or dining room works best (at least 1600 px wide).
            Changes are saved straight away.
          </p>
          <div className="flex flex-wrap gap-2">
            <input
              ref={fileRef}
              type="file"
              accept={HERO_IMAGE_UPLOAD.ACCEPT}
              className="sr-only"
              id="hero-photo-upload"
              disabled={locked}
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) void upload(f);
              }}
            />
            <Button type="button" size="sm" disabled={locked} onClick={() => fileRef.current?.click()} startIcon={<PiUploadSimpleBold className="size-4" />}>
              Upload a photo
            </Button>
            <Button
              type="button"
              size="sm"
              variant="secondary"
              disabled={locked || current === null}
              onClick={() => void choose(null)}
              startIcon={<PiArrowCounterClockwiseBold className="size-4" />}
            >
              Use style&apos;s photo
            </Button>
          </div>
          {error ? <p role="alert" className="text-caption text-destructive">{error}</p> : null}
        </div>
      </div>

      {gallery.length ? (
        <div className="space-y-2">
          <p className="text-body-medium text-foreground">From your gallery</p>
          <div role="radiogroup" aria-label="Your gallery photos" className="grid grid-cols-3 gap-2 sm:grid-cols-5">
            {gallery.slice(0, 15).map((url, i) => (
              <Thumb key={url} url={url} label={`Gallery photo ${i + 1}`} selected={current === url} disabled={locked} onPick={() => void choose(url)} />
            ))}
          </div>
        </div>
      ) : null}

      <div className="space-y-2">
        <p className="text-body-medium text-foreground">Ready-made photos</p>
        <div role="radiogroup" aria-label="Ready-made photos" className="grid grid-cols-3 gap-2 sm:grid-cols-5">
          {STOCK_HERO_PHOTOS.map((p) => (
            <Thumb key={p.url} url={p.url} label={p.label} selected={current === p.url} disabled={locked} onPick={() => void choose(p.url)} />
          ))}
        </div>
      </div>
    </section>
  );
}
