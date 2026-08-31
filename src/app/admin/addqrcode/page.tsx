"use client";

import { useCallback, useEffect, useRef, useState, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ReactQRCode } from "@lglab/react-qr-code";
import type { DownloadFileFormat, ReactQRCodeRef } from "@lglab/react-qr-code";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/ui/PageHeader";
import {
  PiDownloadSimpleBold,
  PiImageBold,
  PiPaletteBold,
  PiQrCodeBold,
  PiUploadSimpleBold,
  PiTrashBold,
  PiArrowSquareOutBold,
  PiCopyBold,
  PiCheckBold,
  PiArrowsClockwiseBold,
  PiFloppyDiskBold,
} from "react-icons/pi";
import { toast } from "@/components/ui/toast";
import { workspaceService, type WorkspaceQrCodeConfig, type WorkspaceData } from "@/services/workspace.service";
import { getApiErrorMessage } from "@/utils/errors";
import { cn } from "@/utils/cn";

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
  url: "",
  size: 256,
  margin: 4,
  dataPattern: "square",
  dataColor: "#1e1b4b",
  finderPattern: "square",
  finderColor: "#1e1b4b",
  backgroundFill: "#ffffff",
  logo: null,
};

export default function QRGeneratorPage() {
  const router = useRouter();
  const ref = useRef<ReactQRCodeRef | null>(null);

  const [workspace, setWorkspace] = useState<WorkspaceData | null>(null);
  const [qrValue, setQrValue] = useState("");
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
  const [copied, setCopied] = useState(false);

  // Compute the live public tenant URL
  const getPublicTenantUrl = useCallback((slug?: string | null) => {
    if (typeof window === "undefined") return "";
    const origin = window.location.origin;
    return slug ? `${origin}/${slug}` : `${origin}/menu`;
  }, []);

  const applyConfig = useCallback((config?: Partial<WorkspaceQrCodeConfig> | null, publicSlug?: string | null) => {
    const fallbackUrl = getPublicTenantUrl(publicSlug);
    // If the config url is missing or placeholder example.com, use real tenant URL
    const finalUrl =
      config?.url && !config.url.includes("example.com")
        ? config.url
        : fallbackUrl;

    setQrValue(finalUrl);
    setSize(config?.size ?? defaultQrConfig.size);
    setMargin(config?.margin ?? defaultQrConfig.margin);
    setBgColor(config?.backgroundFill ?? defaultQrConfig.backgroundFill);
    setFinderStyle((config?.finderPattern as FinderPatternStyle) ?? "square");
    setFinderColor(config?.finderColor ?? defaultQrConfig.finderColor);
    setModuleStyle((config?.dataPattern as DataModuleStyle) ?? "square");
    setModuleColor(config?.dataColor ?? defaultQrConfig.dataColor);
    setLogo(config?.logo ?? null);
  }, [getPublicTenantUrl]);

  useEffect(() => {
    let mounted = true;
    const loadQrConfig = async () => {
      try {
        const response = await workspaceService.getWorkspace();
        if (mounted) {
          setWorkspace(response.data);
          applyConfig(response.data.qrCode, response.data.publicSlug);
        }
      } catch (error) {
        toast.error(getApiErrorMessage(error, "Failed to load QR code settings"));
      } finally {
        if (mounted) setLoading(false);
      }
    };

    void loadQrConfig();
    return () => { mounted = false; };
  }, [applyConfig]);

  const getQrConfig = (): WorkspaceQrCodeConfig => ({
    url: qrValue.trim() || getPublicTenantUrl(workspace?.publicSlug),
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
      const slugName = workspace?.publicSlug || "menu";
      ref.current.download({
        name: `${slugName}-qrcode.${format}`,
        format,
        size: Math.max(size, 512),
      });
      toast.success(`Downloaded QR code as ${format.toUpperCase()}`);
    } else {
      toast.error("QR Code generator is initializing. Try again in a second.");
    }
  };

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(qrValue);
      setCopied(true);
      toast.success("URL copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy URL");
    }
  };

  const handleResetToTenantUrl = () => {
    const url = getPublicTenantUrl(workspace?.publicSlug);
    setQrValue(url);
    toast.success("Reset to your live store URL");
  };

  const handleLogoUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setLogo(reader.result);
          toast.success("Logo added to QR center");
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex h-full flex-col gap-4">
      {/* ─── Header ─────────────────────────────────────────────────────── */}
      <PageHeader
        title="QR Code Generator"
        description="Customize and export your restaurant's digital menu QR code."
        onBack={() => router.push("/admin/home")}
        backLabel="Back"
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => handleDownload("svg")}
              disabled={loading}
              leftIcon={<PiDownloadSimpleBold size={13} />}
            >
              SVG
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => handleDownload("png")}
              disabled={loading}
              leftIcon={<PiDownloadSimpleBold size={13} />}
            >
              PNG
            </Button>
            <Button
              size="sm"
              onClick={handleSave}
              loading={saving}
              disabled={loading}
              leftIcon={<PiFloppyDiskBold size={14} />}
            >
              Save Changes
            </Button>
          </div>
        }
      />

      {/* ─── Two-Column Responsive Layout ───────────────────────────────── */}
      <div className="grid min-h-0 flex-1 grid-cols-1 gap-4 overflow-y-auto lg:grid-cols-12 lg:overflow-hidden">

        {/* ── Left Column (8/12): Customization Controls ── */}
        <div className="flex flex-col gap-4 lg:col-span-7 xl:col-span-8 lg:overflow-y-auto lg:pb-4">

          {/* Destination URL & Dimensions */}
          <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
                  <PiQrCodeBold size={16} />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-primary">Destination</p>
                  <p className="text-sm font-bold text-foreground">Menu Target URL</p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleResetToTenantUrl}
                className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
              >
                <PiArrowsClockwiseBold size={12} />
                Use Store URL
              </button>
            </div>

            <div className="space-y-3">
              <div className="flex gap-2">
                <Input
                  type="text"
                  value={qrValue}
                  onChange={(e) => setQrValue(e.target.value)}
                  className="h-10 font-mono text-xs"
                  placeholder="https://yourstore.com/menu"
                />
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={handleCopyUrl}
                  title="Copy URL"
                  className="shrink-0"
                >
                  {copied ? <PiCheckBold size={14} className="text-emerald-600" /> : <PiCopyBold size={14} />}
                </Button>
                {workspace?.publicSlug && (
                  <a
                    href={`/${workspace.publicSlug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition hover:border-primary/30 hover:bg-primary/5 hover:text-primary"
                    title="Open Live Menu"
                  >
                    <PiArrowSquareOutBold size={16} />
                  </a>
                )}
              </div>

              {workspace?.publicSlug && (
                <p className="text-[11px] text-muted-foreground">
                  Default Store Link: <span className="font-semibold text-foreground">{getPublicTenantUrl(workspace.publicSlug)}</span>
                </p>
              )}
            </div>

            <div className="mt-5 grid grid-cols-1 gap-6 border-t border-border pt-4 sm:grid-cols-2">
              <div>
                <label htmlFor="qr-size-range" className="mb-2 flex justify-between text-xs font-semibold text-muted-foreground">
                  <span>Export Resolution</span>
                  <span className="font-bold text-foreground">{size}×{size}px</span>
                </label>
                <input
                  id="qr-size-range"
                  type="range"
                  min="128"
                  max="800"
                  step="32"
                  value={size}
                  onChange={(e) => setSize(Number(e.target.value))}
                  className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-muted accent-primary"
                />
              </div>

              <div>
                <label htmlFor="qr-margin-range" className="mb-2 flex justify-between text-xs font-semibold text-muted-foreground">
                  <span>Quiet Zone (Padding)</span>
                  <span className="font-bold text-foreground">{margin} blocks</span>
                </label>
                <input
                  id="qr-margin-range"
                  type="range"
                  min="0"
                  max="10"
                  value={margin}
                  onChange={(e) => setMargin(Number(e.target.value))}
                  className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-muted accent-primary"
                />
              </div>
            </div>
          </div>

          {/* Styling, Patterns & Colors */}
          <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <div className="mb-4 flex items-center gap-2.5">
              <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
                <PiPaletteBold size={16} />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-primary">Aesthetics</p>
                <p className="text-sm font-bold text-foreground">Patterns &amp; Color Styling</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

              {/* Data Modules */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-muted-foreground">Data Pattern</span>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="color"
                      value={moduleColor}
                      onChange={(e) => setModuleColor(e.target.value)}
                      className="h-6 w-8 cursor-pointer rounded border border-border p-0"
                    />
                    <span className="font-mono text-[10px] text-muted-foreground">{moduleColor}</span>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-1.5">
                  {dataModuleStyles.map((style) => (
                    <button
                      key={style.value}
                      type="button"
                      onClick={() => setModuleStyle(style.value)}
                      className={cn(
                        "rounded-lg border py-2 text-xs font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring active:scale-[0.98]",
                        moduleStyle === style.value
                          ? "border-primary bg-primary text-primary-foreground shadow-sm"
                          : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:bg-muted"
                      )}
                    >
                      {style.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Finder Patterns */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-muted-foreground">Corner Eye Pattern</span>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="color"
                      value={finderColor}
                      onChange={(e) => setFinderColor(e.target.value)}
                      className="h-6 w-8 cursor-pointer rounded border border-border p-0"
                    />
                    <span className="font-mono text-[10px] text-muted-foreground">{finderColor}</span>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-1.5">
                  {finderStyles.map((style) => (
                    <button
                      key={style.value}
                      type="button"
                      onClick={() => setFinderStyle(style.value)}
                      className={cn(
                        "rounded-lg border py-2 text-xs font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring active:scale-[0.98]",
                        finderStyle === style.value
                          ? "border-primary bg-primary text-primary-foreground shadow-sm"
                          : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:bg-muted"
                      )}
                    >
                      {style.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Background Color */}
              <div className="flex items-center justify-between rounded-lg border border-border bg-muted/30 p-3 sm:col-span-2">
                <div>
                  <p className="text-xs font-semibold text-foreground">Background Fill Color</p>
                  <p className="text-[10px] text-muted-foreground">White (#ffffff) is recommended for best scan reliability.</p>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="h-7 w-10 cursor-pointer rounded border border-border p-0"
                  />
                  <span className="font-mono text-xs text-muted-foreground">{bgColor}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Center Logo Attachment */}
          <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
                  <PiImageBold size={16} />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-primary">Branding</p>
                  <p className="text-sm font-bold text-foreground">Center Logo Icon</p>
                </div>
              </div>
              {logo && (
                <button
                  type="button"
                  onClick={() => setLogo(null)}
                  className="flex items-center gap-1 text-xs font-semibold text-destructive hover:underline"
                >
                  <PiTrashBold size={13} /> Remove
                </button>
              )}
            </div>

            <label className="group flex h-24 w-full cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/30 transition-colors hover:border-primary/40 hover:bg-primary/5 focus-within:ring-2 focus-within:ring-ring">
              <div className="flex flex-col items-center gap-1">
                <PiUploadSimpleBold className="text-muted-foreground transition group-hover:scale-110 group-hover:text-primary" size={22} />
                <span className="text-xs font-semibold text-muted-foreground">Click to upload brand logo for QR center</span>
                <span className="text-[10px] text-muted-foreground/70">PNG, SVG or JPG (Square format works best)</span>
              </div>
              <input type="file" className="sr-only" accept="image/*" onChange={handleLogoUpload} />
            </label>

            {logo && (
              <div className="mt-3 flex items-center gap-3 rounded-lg border border-emerald-200 bg-emerald-50 p-2.5 text-xs text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                <div className="relative size-7 overflow-hidden rounded border border-border bg-white shadow-xs">
                  <Image src={logo} alt="Logo preview" fill unoptimized className="object-cover" />
                </div>
                <span className="font-semibold">Logo embedded into QR center.</span>
              </div>
            )}
          </div>
        </div>

        {/* ── Right Column (4/12): Live QR Display & Export ── */}
        <div className="flex flex-col gap-4 lg:col-span-5 xl:col-span-4">
          <div className="flex flex-col items-center rounded-xl border border-border bg-card p-6 shadow-sm">
            <p className="mb-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">Live Print Preview</p>

            {/* QR Card Container */}
            <div className="flex w-full flex-col items-center justify-center rounded-2xl border border-border bg-muted/40 p-6">
              <div className="flex aspect-square w-full max-w-[240px] items-center justify-center rounded-2xl border border-border bg-white p-4 shadow-md [&>svg]:block [&>svg]:h-full [&>svg]:w-full">
                <ReactQRCode
                  ref={ref}
                  value={qrValue || "https://example.com"}
                  size={240}
                  marginSize={margin}
                  background={bgColor}
                  dataModulesSettings={{ style: moduleStyle, color: moduleColor } as never}
                  finderPatternInnerSettings={{ style: finderStyle, color: finderColor } as never}
                  finderPatternOuterSettings={{ style: finderStyle, color: finderColor } as never}
                  imageSettings={
                    logo
                      ? {
                          src: logo,
                          width: 46,
                          height: 46,
                          excavate: true,
                          opacity: 1,
                        }
                      : undefined
                  }
                />
              </div>
              <p className="mt-3 text-[11px] font-semibold text-muted-foreground">Scan with smartphone camera</p>
            </div>

            {/* Quick Export Action Buttons */}
            <div className="mt-4 grid w-full grid-cols-2 gap-2">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => handleDownload("svg")}
                leftIcon={<PiDownloadSimpleBold size={14} />}
                className="w-full"
              >
                Download SVG
              </Button>
              <Button
                type="button"
                size="sm"
                onClick={() => handleDownload("png")}
                leftIcon={<PiDownloadSimpleBold size={14} />}
                className="w-full"
              >
                Download PNG
              </Button>
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleSave}
              loading={saving}
              leftIcon={<PiFloppyDiskBold size={14} />}
              className="mt-2 w-full"
            >
              Save Custom QR Style
            </Button>

            {/* Print Spec Details */}
            <div className="mt-4 w-full space-y-1.5 border-t border-border pt-3 text-xs text-muted-foreground">
              <div className="flex justify-between">
                <span>Output Resolution</span>
                <span className="font-semibold text-foreground">{size}×{size}px</span>
              </div>
              <div className="flex justify-between">
                <span>Target URL</span>
                <span className="max-w-[140px] truncate font-semibold text-foreground">{qrValue || "None"}</span>
              </div>
              <div className="flex justify-between">
                <span>Format Options</span>
                <span className="font-semibold text-foreground">Vector (SVG) / Raster (PNG)</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
