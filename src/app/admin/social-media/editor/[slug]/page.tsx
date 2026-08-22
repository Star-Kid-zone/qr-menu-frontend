"use client";

import { use, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toBlob } from "html-to-image";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageHeader } from "@/components/ui/PageHeader";
import { toast } from "@/components/ui/toast";
import { PiArrowCounterClockwiseBold, PiDownloadSimpleBold, PiFloppyDiskBold, PiImagesBold } from "react-icons/pi";
import { PosterCanvas, type PosterCanvasHandle } from "@/components/marketing/PosterCanvas";
import { getPosterTemplate } from "@/components/marketing/posterTemplates";
import { marketingService } from "@/services/marketing.service";
import { getApiErrorMessage } from "@/utils/errors";

const EDITOR_RENDER_WIDTH = 480;

export default function PosterEditorPage({ params }: { params: Promise<{ slug: string }> }) {
  const router = useRouter();
  const { slug } = use(params);
  const template = getPosterTemplate(slug);

  const canvasRef = useRef<PosterCanvasHandle>(null);
  const captureNodeRef = useRef<HTMLDivElement>(null);
  const [saving, setSaving] = useState(false);
  const [downloading, setDownloading] = useState(false);

  if (!template) {
    return (
      <div className="flex h-full items-center justify-center">
        <EmptyState
          icon={<PiImagesBold size={32} />}
          title="Template not found"
          description="This poster template doesn't exist or may have been removed."
          action={
            <Link href="/admin/social-media" className={buttonVariants()}>
              Back to templates
            </Link>
          }
        />
      </div>
    );
  }

  const captureBlob = async (): Promise<Blob | null> => {
    const el = captureNodeRef.current;
    if (!el) return null;

    if (document.activeElement instanceof HTMLElement && el.contains(document.activeElement)) {
      document.activeElement.blur();
    }

    // Unconditionally strip the hover/focus editing-affordance ring from every field
    // right before the snapshot, then restore it — otherwise it can get baked into
    // the exported image. Killing `transition` first matters: the field has a
    // `transition-shadow`, so without this, getComputedStyle() (which html-to-image
    // reads synchronously) returns the mid-fade interpolated shadow, not "none".
    const fieldEls = Array.from(el.querySelectorAll<HTMLElement>("[data-field-id]"));
    fieldEls.forEach((field) => {
      field.style.setProperty("transition", "none", "important");
      field.style.setProperty("box-shadow", "none", "important");
    });
    try {
      return await toBlob(el, { pixelRatio: 2 });
    } finally {
      fieldEls.forEach((field) => {
        field.style.removeProperty("box-shadow");
        field.style.removeProperty("transition");
      });
    }
  };

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const blob = await captureBlob();
      if (!blob) throw new Error("Could not render poster.");
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${template.slug}.png`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      toast.error("Failed to download poster. Please try again.");
    } finally {
      setDownloading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const values = canvasRef.current?.getValues() ?? {};
      const blob = await captureBlob();

      const formData = new FormData();
      formData.append("templateSlug", template.slug);
      formData.append("textValues", JSON.stringify(values));
      if (blob) {
        formData.append("image", blob, `${template.slug}.png`);
      }

      await marketingService.savePosterDesign(formData);
      toast.success("Poster saved to your workspace.");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to save poster."));
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    canvasRef.current?.reset();
  };

  return (
    <div className="flex h-full flex-col gap-4 overflow-y-auto pb-4">
      <PageHeader
        title={template.name}
        description="Click any text to edit it. Images and layout stay locked to the template."
        onBack={() => router.push("/admin/social-media")}
        backLabel="Templates"
        actions={
          <>
            <Button variant="secondary" leftIcon={<PiArrowCounterClockwiseBold size={16} />} onClick={handleReset}>
              Reset Text
            </Button>
            <Button
              variant="secondary"
              leftIcon={<PiDownloadSimpleBold size={16} />}
              loading={downloading}
              onClick={handleDownload}
            >
              Download PNG
            </Button>
            <Button leftIcon={<PiFloppyDiskBold size={16} />} loading={saving} onClick={handleSave}>
              Save Poster
            </Button>
          </>
        }
      />

      <div className="flex flex-1 items-start justify-center py-2">
        <Card tone="ghost" className="overflow-hidden border border-border shadow-neu">
          <div ref={captureNodeRef}>
            <PosterCanvas
              ref={canvasRef}
              config={template}
              renderWidth={EDITOR_RENDER_WIDTH}
              editable
            />
          </div>
        </Card>
      </div>

      <Card className="shrink-0">
        <CardContent className="p-4 text-caption text-muted-foreground">
          Tip: click directly on the headline, subtext, or price to edit it in place. The background,
          colours, and layout are fixed to this template — only the words are yours to change.
        </CardContent>
      </Card>
    </div>
  );
}
