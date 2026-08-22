"use client";

import { useCallback, useEffect, useRef, useState, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { ReactQRCode } from "@lglab/react-qr-code";
import type { DownloadFileFormat, ReactQRCodeRef } from "@lglab/react-qr-code";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/ui/PageHeader";
import { fadeInUp, staggerContainer } from "@/lib/motion";
import {
  PiDownloadSimpleBold,
  PiImageBold,
  PiPaletteBold,
  PiQrCodeBold,
  PiUploadSimpleBold,
  PiTrashBold,
} from "react-icons/pi";
import { toast } from "@/components/ui/toast";
import { workspaceService, type WorkspaceQrCodeConfig } from "@/services/workspace.service";
import { getApiErrorMessage } from "@/utils/errors";

// Type definitions matching the legacy structure
type FinderPatternStyle = "square" | "leaf-lg" | "pinched-square" | "circle" | "heart" | "rounded";
type DataModuleStyle = "square" | "circle" | "leaf" | "vertical-line" | "box" | "plus";

const finderStyles: { value: FinderPatternStyle; label: string }[] = [
  { value: "square", label: "Square" },
  { value: "leaf-lg", label: "Leaf" },
  { value: "pinched-square", label: "Pinched" },
  { value: "circle", label: "Circle" },
  { value: "heart", label: "Heart" },
  { value: "rounded", label: "Rounded" },
];

const dataModuleStyles: { value: DataModuleStyle; label: string }[] = [
  { value: "square", label: "Square" },
  { value: "circle", label: "Circle" },
  { value: "leaf", label: "Leaf" },
  { value: "vertical-line", label: "Vertical" },
  { value: "box", label: "Box" },
  { value: "plus", label: "Plus" },
];

const defaultQrConfig: WorkspaceQrCodeConfig = {
  url: "https://example.com/menu",
  size: 256,
  margin: 4,
  dataPattern: "square",
  dataColor: "#000000",
  finderPattern: "square",
  finderColor: "#000000",
  backgroundFill: "#ffffff",
  logo: null,
};

export default function QRGeneratorPage() {
  const router = useRouter();
  const ref = useRef<ReactQRCodeRef | null>(null);
  const prefersReducedMotion = useReducedMotion();

  const [qrValue, setQrValue] = useState(defaultQrConfig.url);
  const [size, setSize] = useState(defaultQrConfig.size);
  const [margin, setMargin] = useState(defaultQrConfig.margin);
  const [bgColor, setBgColor] = useState(defaultQrConfig.backgroundFill);
  const [finderStyle, setFinderStyle] = useState<FinderPatternStyle>("square");
  const [finderColor, setFinderColor] = useState(defaultQrConfig.finderColor);
  const [moduleStyle, setModuleStyle] = useState<DataModuleStyle>("square");
  const [moduleColor, setModuleColor] = useState(defaultQrConfig.dataColor);
  const [logo, setLogo] = useState<string | null>(defaultQrConfig.logo);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const applyConfig = useCallback((config?: Partial<WorkspaceQrCodeConfig> | null) => {
    const next = { ...defaultQrConfig, ...config };
    setQrValue(next.url);
    setSize(next.size);
    setMargin(next.margin);
    setBgColor(next.backgroundFill);
    setFinderStyle(next.finderPattern as FinderPatternStyle);
    setFinderColor(next.finderColor);
    setModuleStyle(next.dataPattern as DataModuleStyle);
    setModuleColor(next.dataColor);
    setLogo(next.logo);
  }, []);

  useEffect(() => {
    let mounted = true;

    const loadQrConfig = async () => {
      try {
        const response = await workspaceService.getWorkspace();
        if (mounted) {
          applyConfig(response.data.qrCode);
        }
      } catch (error) {
        toast.error(getApiErrorMessage(error, "Failed to load QR code settings"));
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    void loadQrConfig();

    return () => {
      mounted = false;
    };
  }, [applyConfig]);

  const getQrConfig = (): WorkspaceQrCodeConfig => ({
    url: qrValue,
    size,
    margin,
    dataPattern: moduleStyle,
    dataColor: moduleColor,
    finderPattern: finderStyle,
    finderColor,
    backgroundFill: bgColor,
    logo,
  });

  const handleSave = async () => {
    setSaving(true);
    try {
      await workspaceService.updateWorkspace({ qrCode: getQrConfig() });
      toast.success("QR code settings saved");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to save QR code settings"));
    } finally {
      setSaving(false);
    }
  };

  const handleDownload = (format: DownloadFileFormat) => {
    if (ref.current && typeof ref.current.download === "function") {
      ref.current.download({
        name: `custom-qr-code.${format}`,
        format,
        size: 1024,
      });
    }
  };

  const handleLogoUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setLogo(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex h-full flex-col gap-4">
      <PageHeader
        title="QR Code Asset"
        description="Customize the look of your menu's QR code and export it for print or digital use."
        onBack={() => router.push("/admin/home")}
        backLabel="Back"
        actions={
          <>
            <Button variant="secondary" className="w-full sm:w-auto" onClick={handleSave} disabled={saving || loading}>
              {saving ? "Saving…" : "Save"}
            </Button>
            <Button variant="secondary" className="w-full sm:w-auto" onClick={() => handleDownload("svg")}>
              SVG
            </Button>
            <Button className="w-full sm:w-auto" onClick={() => handleDownload("png")}>
              <PiDownloadSimpleBold size={16} /> PNG
            </Button>
          </>
        }
      />

      <motion.div
        className="grid min-h-0 flex-1 grid-cols-1 gap-4 lg:grid-cols-3"
        initial={prefersReducedMotion ? undefined : "hidden"}
        animate={prefersReducedMotion ? undefined : "visible"}
        variants={staggerContainer(0.06)}
      >
        {/* Editor Settings */}
        <div className="min-h-0 space-y-4 overflow-y-auto lg:col-span-2">
          <motion.div variants={fadeInUp}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-body text-foreground">
                <PiQrCodeBold className="text-primary" size={18} /> Content &amp; Dimensions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="mb-1.5 block text-caption font-semibold uppercase tracking-wider text-muted-foreground">
                  QR Code URL
                </label>
                <Input
                  type="text"
                  value={qrValue}
                  onChange={(e) => setQrValue(e.target.value)}
                  className="font-mono text-sm"
                  placeholder="https://example.com"
                />
              </div>
              <div className="grid grid-cols-1 gap-6 pt-2 sm:grid-cols-2">
                <div>
                  <label htmlFor="qr-size-range" className="mb-2 flex justify-between text-caption font-semibold uppercase tracking-wider text-muted-foreground">
                    <span>Size</span>
                    <span className="text-primary">{size}px</span>
                  </label>
                  <input
                    id="qr-size-range"
                    type="range"
                    min="100"
                    max="600"
                    value={size}
                    onChange={(e) => setSize(Number(e.target.value))}
                    className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-muted accent-primary"
                  />
                </div>
                <div>
                  <label htmlFor="qr-margin-range" className="mb-2 flex justify-between text-caption font-semibold uppercase tracking-wider text-muted-foreground">
                    <span>Quiet Zone (Margin)</span>
                    <span className="text-primary">{margin}</span>
                  </label>
                  <input
                    id="qr-margin-range"
                    type="range"
                    min="0"
                    max="20"
                    value={margin}
                    onChange={(e) => setMargin(Number(e.target.value))}
                    className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-muted accent-primary"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          </motion.div>

          <motion.div variants={fadeInUp}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-body text-foreground">
                <PiPaletteBold className="text-primary" size={18} /> Colors &amp; Patterns
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {/* Data Modules */}
              <div className="space-y-3">
                <label className="block text-caption font-semibold uppercase tracking-wider text-muted-foreground">
                  Data Pattern
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {dataModuleStyles.map((style) => (
                    <button
                      key={style.value}
                      type="button"
                      onClick={() => setModuleStyle(style.value)}
                      aria-pressed={moduleStyle === style.value}
                      className={`rounded-md border px-2 py-1.5 text-caption font-semibold transition-colors duration-150 ease-out active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 ${
                        moduleStyle === style.value
                          ? "border-primary/30 bg-primary/10 text-primary"
                          : "border-border bg-card text-muted-foreground hover:bg-accent"
                      }`}
                    >
                      {style.label}
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-3 pt-2">
                  <input
                    type="color"
                    value={moduleColor}
                    onChange={(e) => setModuleColor(e.target.value)}
                    aria-label="Data pattern color"
                    className="h-8 w-12 cursor-pointer rounded border-0 p-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
                  />
                  <span className="font-mono text-caption font-medium text-muted-foreground">{moduleColor}</span>
                </div>
              </div>

              {/* Finder Patterns */}
              <div className="space-y-3">
                <label className="block text-caption font-semibold uppercase tracking-wider text-muted-foreground">
                  Finder Pattern
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {finderStyles.map((style) => (
                    <button
                      key={style.value}
                      type="button"
                      onClick={() => setFinderStyle(style.value)}
                      aria-pressed={finderStyle === style.value}
                      className={`rounded-md border px-2 py-1.5 text-caption font-semibold transition-colors duration-150 ease-out active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 ${
                        finderStyle === style.value
                          ? "border-primary/30 bg-primary/10 text-primary"
                          : "border-border bg-card text-muted-foreground hover:bg-accent"
                      }`}
                    >
                      {style.label}
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-3 pt-2">
                  <input
                    type="color"
                    value={finderColor}
                    onChange={(e) => setFinderColor(e.target.value)}
                    aria-label="Finder pattern color"
                    className="h-8 w-12 cursor-pointer rounded border-0 p-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
                  />
                  <span className="font-mono text-caption font-medium text-muted-foreground">{finderColor}</span>
                </div>
              </div>

              {/* Background Color */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border pt-4 sm:col-span-2">
                <label className="text-caption font-semibold uppercase tracking-wider text-muted-foreground">Background Fill</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    aria-label="Background fill color"
                    className="h-8 w-12 cursor-pointer rounded border-0 p-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
                  />
                  <span className="font-mono text-caption font-medium text-muted-foreground">{bgColor}</span>
                </div>
              </div>
            </CardContent>
          </Card>
          </motion.div>

          <motion.div variants={fadeInUp}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-body text-foreground">
                <PiImageBold className="text-primary" size={18} /> Center Logo
              </CardTitle>
              {logo && (
                <button
                  type="button"
                  onClick={() => setLogo(null)}
                  className="flex items-center gap-1 rounded text-caption font-semibold text-destructive transition-colors hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
                >
                  <PiTrashBold size={13} /> Remove
                </button>
              )}
            </CardHeader>
            <CardContent>
              <label className="group flex h-24 w-full cursor-pointer flex-col items-center justify-center rounded-md border border-dashed border-border transition-colors hover:bg-accent focus-within:ring-2 focus-within:ring-ring/40">
                <div className="flex flex-col items-center gap-1">
                  <PiUploadSimpleBold className="text-muted-foreground transition-colors group-hover:text-primary" size={22} />
                  <span className="text-caption font-semibold text-muted-foreground">Click to upload brand logo</span>
                </div>
                <input type="file" className="sr-only" accept="image/*" onChange={handleLogoUpload} />
              </label>
              {logo && (
                <div className="mt-3 flex items-center justify-center gap-2 rounded-md border border-success/20 bg-success/15 p-2 text-center text-caption font-semibold text-success">
                  <div className="relative h-6 w-6 overflow-hidden rounded-md border border-success/20 bg-card">
                    <Image
                      src={logo}
                      alt="Logo preview"
                      fill
                      unoptimized
                      className="object-cover"
                    />
                  </div>
                  Logo attached and ready
                </div>
              )}
            </CardContent>
          </Card>
          </motion.div>
        </div>

        {/* Live Preview Panel */}
        <motion.div variants={fadeInUp} className="min-h-0 lg:col-span-1">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-center text-body text-foreground">Live Preview</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <div className="mb-6 flex w-full max-w-full items-center justify-center rounded-2xl border border-border bg-muted p-4 sm:p-6">
                <div className="flex aspect-square w-full max-w-[200px] items-center justify-center rounded-xl border border-border bg-card p-2 sm:p-3 [&>svg]:block [&>svg]:h-full [&>svg]:w-full">
                  <ReactQRCode
                    ref={ref}
                    value={qrValue}
                    size={Math.min(size, 200)}
                    marginSize={margin}
                    background={bgColor}
                    dataModulesSettings={{ style: moduleStyle, color: moduleColor } as never}
                    finderPatternInnerSettings={{ style: finderStyle, color: finderColor } as never}
                    finderPatternOuterSettings={{ style: finderStyle, color: finderColor } as never}
                    imageSettings={
                      logo
                        ? {
                            src: logo,
                            width: 40,
                            height: 40,
                            excavate: true,
                            opacity: 1,
                          }
                        : undefined
                    }
                  />
                </div>
              </div>

              <div className="w-full space-y-2 border-t border-border pt-4 text-caption font-medium text-muted-foreground">
                <div className="flex justify-between">
                  <span>Export Resolution</span>
                  <span className="font-semibold text-foreground">{size}×{size}px</span>
                </div>
                <div className="flex justify-between">
                  <span>Output Format</span>
                  <span className="font-semibold text-foreground">PNG / SVG</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}
