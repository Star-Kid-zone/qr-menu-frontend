"use client";

import { useCallback, useEffect, useRef, useState, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ReactQRCode } from "@lglab/react-qr-code";
import type {
  DataModulesStyle,
  DownloadFileFormat,
  FinderPatternOuterStyle,
  ReactQRCodeRef,
} from "@lglab/react-qr-code";
import { Button } from "@/components/ui/button";
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
  PiFloppyDiskBold,
  PiBookOpenBold,
  PiStorefrontBold,
  PiShuffleBold,
} from "react-icons/pi";
import { buildPublicLandingUrl, buildPublicMenuUrl } from "@/utils/tenantHost";
import { toast } from "@/components/ui/toast";
import {
  workspaceService,
  type WorkspaceQrCodeConfig,
  type WorkspaceData,
} from "@/services/workspace.service";
import { getApiErrorMessage } from "@/utils/errors";
import { cn } from "@/utils/cn";
import { PermissionGuard } from "@/components/auth/PermissionGuard";

export type FinderPatternStyle =
  | "square"
  | "leaf-lg"
  | "pinched-square"
  | "circle"
  | "heart"
  | "rounded";

export type DataModuleStyle =
  | "square"
  | "box"
  | "circle"
  | "rounded"
  | "plus"
  | "leaf"
  | "vertical-line"
  | "horizontal-line"
  | "diamond"
  | "star"
  | "heart"
  | "circuit-board";

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
  { value: "box", label: "Box" },
  { value: "circle", label: "Circle" },
  { value: "rounded", label: "Rounded" },
  { value: "plus", label: "Plus" },
  { value: "leaf", label: "Leaf" },
  { value: "vertical-line", label: "Vertical" },
  { value: "horizontal-line", label: "Horizontal" },
  { value: "diamond", label: "Diamond" },
  { value: "star", label: "Star" },
  { value: "heart", label: "Heart" },
  { value: "circuit-board", label: "Circuit" },
];

function toReactQrModuleStyle(style: DataModuleStyle | string): DataModulesStyle {
  if (style === "box" || style === "square-sm") return "square-sm";
  if (style === "plus" || style === "hashtag") return "hashtag";
  return (style as DataModulesStyle) || "square";
}

function toFinderOuterStyle(style: FinderPatternStyle): FinderPatternOuterStyle {
  if (style === "heart") return "circle";
  return style as FinderPatternOuterStyle;
}

const defaultQrConfig: WorkspaceQrCodeConfig = {
  url: "",
  size: 512,
  margin: 4,
  dataPattern: "square",
  dataColor: "#1e1b4b",
  finderPattern: "square",
  finderColor: "#1e1b4b",
  backgroundFill: "#ffffff",
  logo: null,
};

const RESOLUTION_PRESETS = [256, 384, 512, 672, 768, 1024];
const MARGIN_PRESETS = [0, 2, 4, 6, 8];

const RANDOM_COLOR_PRESETS = [
  { name: "Midnight Navy", bg: "#ffffff", module: "#1e1b4b", finder: "#312e81" },
  { name: "Emerald & Cream", bg: "#fafaf9", module: "#064e3b", finder: "#047857" },
  { name: "Crimson Luxe", bg: "#fff1f2", module: "#881337", finder: "#be123c" },
  { name: "Deep Teal", bg: "#f0fdfa", module: "#134e4a", finder: "#0f766e" },
  { name: "Obsidian & Gold", bg: "#ffffff", module: "#18181b", finder: "#d97706" },
  { name: "Royal Indigo", bg: "#f5f3ff", module: "#3730a3", finder: "#4f46e5" },
  { name: "Espresso Warmth", bg: "#fffbeb", module: "#451a03", finder: "#78350f" },
  { name: "Ocean Breeze", bg: "#f0f9ff", module: "#075985", finder: "#0284c7" },
  { name: "Classic Monochrome", bg: "#ffffff", module: "#09090b", finder: "#18181b" },
  { name: "Electric Purple", bg: "#ffffff", module: "#581c87", finder: "#7e22ce" },
  { name: "Terracotta Sunset", bg: "#fef2f2", module: "#7c2d12", finder: "#ea580c" },
  { name: "Nordic Forest", bg: "#f0fdf4", module: "#14532d", finder: "#15803d" },
  { name: "Cyber Night", bg: "#0f172a", module: "#38bdf8", finder: "#818cf8" },
  { name: "Dark Velvet", bg: "#18181b", module: "#f43f5e", finder: "#fb7185" },
  { name: "Gilded Obsidian", bg: "#09090b", module: "#fbbf24", finder: "#f59e0b" },
  { name: "Berry Plum", bg: "#fdf2f8", module: "#701a75", finder: "#a21caf" },
  { name: "Slate Minimal", bg: "#f8fafc", module: "#1e293b", finder: "#334155" },
  { name: "Charcoal Emerald", bg: "#ffffff", module: "#1c1917", finder: "#059669" },
];

function QRGeneratorPageContent() {
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

  const applyConfig = useCallback(
    (config?: Partial<WorkspaceQrCodeConfig> | null, publicSlug?: string | null) => {
      const defaultLandingUrl = buildPublicLandingUrl(publicSlug) || "";
      const finalUrl =
        config?.url && !config.url.includes("example.com")
          ? config.url
          : defaultLandingUrl;

      setQrValue(finalUrl || "");
      setSize(config?.size ?? defaultQrConfig.size);
      setMargin(config?.margin ?? defaultQrConfig.margin);
      setBgColor(config?.backgroundFill ?? defaultQrConfig.backgroundFill);
      setFinderStyle((config?.finderPattern as FinderPatternStyle) ?? "square");
      setFinderColor(config?.finderColor ?? defaultQrConfig.finderColor);
      setModuleStyle((config?.dataPattern as DataModuleStyle) ?? "square");
      setModuleColor(config?.dataColor ?? defaultQrConfig.dataColor);
      setLogo(config?.logo ?? null);
    },
    []
  );

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

  const landingUrl = buildPublicLandingUrl(workspace?.publicSlug);
  const menuUrl = buildPublicMenuUrl(workspace?.publicSlug);

  const getQrConfig = (): WorkspaceQrCodeConfig => ({
    url: qrValue.trim() || landingUrl,
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
      toast.success("QR code settings saved successfully");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to save QR code settings"));
    } finally {
      setSaving(false);
    }
  };

  const handleDownload = (format: DownloadFileFormat) => {
    if (ref.current && typeof ref.current.download === "function") {
      const slugName = workspace?.publicSlug || "menu";
      ref.current.download({ name: `${slugName}-qrcode.${format}`, format, size });
      toast.success(`Downloaded ${size}x${size}px QR code as ${format.toUpperCase()}`);
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

  const handleRandomizeColors = () => {
    const available = RANDOM_COLOR_PRESETS.filter(
      (p) => p.module !== moduleColor || p.finder !== finderColor || p.bg !== bgColor
    );
    const pool = available.length > 0 ? available : RANDOM_COLOR_PRESETS;
    const selected = pool[Math.floor(Math.random() * pool.length)];

    setBgColor(selected.bg);
    setModuleColor(selected.module);
    setFinderColor(selected.finder);
    toast.success(`Randomized colors: ${selected.name}`);
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

  const printSizeCm = (size / 118.11).toFixed(1);
  const printSizeInches = (size / 300).toFixed(1);

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden">
      {/* Header */}
      <div className="shrink-0">
        <PageHeader
          title="QR Code Generator"
          description="Customize, preview, and export your restaurant's QR code."
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
                PNG ({size}px)
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
      </div>

      {/* Body: Two-column, no global scroll */}
      <div className="grid min-h-0 flex-1 grid-cols-1 gap-3 overflow-hidden lg:grid-cols-12 px-1 pb-3">

        {/* LEFT COLUMN: scrollable controls */}
        <div className="min-h-0 overflow-y-auto lg:col-span-7 xl:col-span-8 space-y-3 pr-1">

          {/* Card 1: QR Target URL */}
          <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
            <div className="mb-3 flex items-center gap-2.5">
              <div className="flex size-7 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
                <PiQrCodeBold size={14} />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-primary">Destination</p>
                <p className="text-sm font-bold text-foreground">QR Target URL</p>
              </div>
            </div>

            {/* URL preset tiles */}
            {(landingUrl || menuUrl) && (
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {landingUrl && (
                  <button
                    type="button"
                    onClick={() => { setQrValue(landingUrl); toast.success("Set to Storefront landing page"); }}
                    className={cn(
                      "flex flex-col items-start gap-1 rounded-lg border p-2.5 text-left transition-all",
                      qrValue === landingUrl
                        ? "border-primary bg-primary/5 ring-1 ring-primary"
                        : "border-border bg-muted/30 hover:border-primary/40 hover:bg-muted/60"
                    )}
                  >
                    <div className="flex w-full items-center gap-1.5">
                      <PiStorefrontBold size={13} className={qrValue === landingUrl ? "text-primary" : "text-muted-foreground"} />
                      <span className={cn("text-[10px] font-bold uppercase tracking-widest", qrValue === landingUrl ? "text-primary" : "text-muted-foreground")}>
                        Storefront
                      </span>
                      {qrValue === landingUrl && (
                        <span className="ml-auto rounded-full bg-primary px-1.5 py-0.5 text-[9px] font-bold text-primary-foreground">Active</span>
                      )}
                    </div>
                    <span className="max-w-full truncate font-mono text-[10px] text-foreground" title={landingUrl}>
                      {landingUrl}
                    </span>
                  </button>
                )}
                {menuUrl && (
                  <button
                    type="button"
                    onClick={() => { setQrValue(menuUrl); toast.success("Set to Digital Menu page"); }}
                    className={cn(
                      "flex flex-col items-start gap-1 rounded-lg border p-2.5 text-left transition-all",
                      qrValue === menuUrl
                        ? "border-primary bg-primary/5 ring-1 ring-primary"
                        : "border-border bg-muted/30 hover:border-primary/40 hover:bg-muted/60"
                    )}
                  >
                    <div className="flex w-full items-center gap-1.5">
                      <PiBookOpenBold size={13} className={qrValue === menuUrl ? "text-primary" : "text-muted-foreground"} />
                      <span className={cn("text-[10px] font-bold uppercase tracking-widest", qrValue === menuUrl ? "text-primary" : "text-muted-foreground")}>
                        Digital Menu
                      </span>
                      {qrValue === menuUrl && (
                        <span className="ml-auto rounded-full bg-primary px-1.5 py-0.5 text-[9px] font-bold text-primary-foreground">Active</span>
                      )}
                    </div>
                    <span className="max-w-full truncate font-mono text-[10px] text-foreground" title={menuUrl}>
                      {menuUrl}
                    </span>
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Card 2: Resolution & Quiet Zone */}
          <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* Resolution */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <label htmlFor="qr-size-range" className="font-semibold text-muted-foreground">
                    Export Resolution
                  </label>
                  <span className="font-bold text-foreground">
                    {size}&times;{size}px{" "}
                    <span className="text-[10px] font-normal text-muted-foreground">
                      (~{printSizeCm}cm / {printSizeInches}&quot; @ 300dpi)
                    </span>
                  </span>
                </div>
                <input
                  id="qr-size-range"
                  type="range"
                  min="128"
                  max="1024"
                  step="32"
                  value={size}
                  onChange={(e) => setSize(Number(e.target.value))}
                  className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-muted accent-primary"
                />
                <div className="flex flex-wrap items-center gap-1">
                  {RESOLUTION_PRESETS.map((res) => (
                    <button
                      key={res}
                      type="button"
                      onClick={() => setSize(res)}
                      className={cn(
                        "rounded px-2 py-0.5 text-[10px] font-semibold transition-all",
                        size === res
                          ? "bg-primary text-primary-foreground shadow-xs"
                          : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                      )}
                    >
                      {res}px
                    </button>
                  ))}
                </div>
              </div>

              {/* Margin */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <label htmlFor="qr-margin-range" className="font-semibold text-muted-foreground">
                    Quiet Zone (Border)
                  </label>
                  <span className="font-bold text-foreground">
                    {margin} {margin === 1 ? "block" : "blocks"}
                  </span>
                </div>
                <input
                  id="qr-margin-range"
                  type="range"
                  min="0"
                  max="8"
                  value={margin}
                  onChange={(e) => setMargin(Number(e.target.value))}
                  className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-muted accent-primary"
                />
                <div className="flex flex-wrap items-center gap-1">
                  {MARGIN_PRESETS.map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setMargin(m)}
                      className={cn(
                        "rounded px-2 py-0.5 text-[10px] font-semibold transition-all",
                        margin === m
                          ? "bg-primary text-primary-foreground shadow-xs"
                          : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                      )}
                    >
                      {m === 0 ? "0 (Flush)" : `${m}b`}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: Aesthetics — Patterns + All 3 Colors in one unified card */}
          <div className="rounded-xl border border-border bg-card p-3.5 shadow-sm sm:p-4">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="flex size-7 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
                  <PiPaletteBold size={14} />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-primary">Aesthetics</p>
                  <p className="text-sm font-bold text-foreground">Patterns &amp; Colors</p>
                </div>
              </div>

              {/* Randomize Colors Button */}
              <button
                type="button"
                onClick={handleRandomizeColors}
                className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-2.5 py-1 text-xs font-semibold text-foreground shadow-2xs transition-all hover:border-primary/40 hover:bg-primary/5 hover:text-primary active:scale-95 cursor-pointer"
                title="Randomly select colors for background, data pattern, and corner eyes"
              >
                <PiShuffleBold size={13} className="text-primary" />
                <span>Random Select</span>
              </button>
            </div>

            {/* Side-by-side grid for Data Pattern and Corner Eye Pattern */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {/* Left Column: Data Pattern + Color */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold text-foreground">Data Pattern</span>
                    <p className="text-[10px] text-muted-foreground">Module shape</p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-muted-foreground font-medium">Color</span>
                    <input
                      type="color"
                      value={moduleColor}
                      onChange={(e) => setModuleColor(e.target.value)}
                      className="h-6 w-8 cursor-pointer rounded border border-border p-0"
                      title="Data module color"
                    />
                    <span className="font-mono text-[10px] text-muted-foreground w-12 hidden sm:inline">
                      {moduleColor}
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-1">
                  {dataModuleStyles.map((style) => (
                    <button
                      key={style.value}
                      type="button"
                      onClick={() => setModuleStyle(style.value)}
                      className={cn(
                        "rounded-md border py-1.5 text-xs font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring active:scale-[0.98]",
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

              {/* Right Column: Corner Eye Pattern + Color */}
              <div className="space-y-2 md:border-l md:border-border md:pl-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold text-foreground">Corner Eye Pattern</span>
                    <p className="text-[10px] text-muted-foreground">Positioning markers</p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-muted-foreground font-medium">Color</span>
                    <input
                      type="color"
                      value={finderColor}
                      onChange={(e) => setFinderColor(e.target.value)}
                      className="h-6 w-8 cursor-pointer rounded border border-border p-0"
                      title="Corner eye color"
                    />
                    <span className="font-mono text-[10px] text-muted-foreground w-12 hidden sm:inline">
                      {finderColor}
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-1">
                  {finderStyles.map((style) => (
                    <button
                      key={style.value}
                      type="button"
                      onClick={() => setFinderStyle(style.value)}
                      className={cn(
                        "rounded-md border py-1.5 text-xs font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring active:scale-[0.98]",
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
            </div>

            {/* Background Color row */}
            <div className="mt-3 flex items-center justify-between rounded-lg border border-border bg-muted/30 px-3 py-2">
              <div>
                <p className="text-xs font-semibold text-foreground">Background Color</p>
                <p className="text-[10px] text-muted-foreground">
                  Light backgrounds (#ffffff) provide the highest contrast and scan reliability.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="h-6 w-8 cursor-pointer rounded border border-border p-0"
                  title="Background fill color"
                />
                <span className="font-mono text-xs text-muted-foreground w-12 hidden sm:inline">
                  {bgColor}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Live Preview + Logo Upload */}
        <div className="min-h-0 overflow-hidden flex flex-col gap-2.5 lg:col-span-5 xl:col-span-4">

          {/* Live QR Preview Card */}
          <div className="rounded-xl border border-border bg-card p-3 sm:p-3.5 shadow-sm flex flex-col items-center">
            <div className="mb-2.5 flex w-full items-center justify-between">
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                Live Print Preview
              </p>
              <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-bold text-primary">
                {size}&times;{size}px
              </span>
            </div>

            <div className="flex w-full flex-col items-center justify-center rounded-xl border border-border bg-muted/30 p-2.5">
              <div
                className="relative flex aspect-square w-full max-w-[185px] sm:max-w-[205px] items-center justify-center overflow-hidden rounded-xl border border-border shadow-md transition-all duration-200 [&>svg]:block [&>svg]:h-full [&>svg]:w-full"
                style={{ backgroundColor: bgColor }}
              >
                <ReactQRCode
                  ref={ref}
                  value={qrValue || "https://example.com"}
                  size={size}
                  marginSize={margin}
                  background={bgColor}
                  dataModulesSettings={{
                    style: toReactQrModuleStyle(moduleStyle),
                    color: moduleColor,
                  }}
                  finderPatternInnerSettings={{
                    style: finderStyle,
                    color: finderColor,
                  }}
                  finderPatternOuterSettings={{
                    style: toFinderOuterStyle(finderStyle),
                    color: finderColor,
                  }}
                  imageSettings={
                    logo
                      ? { src: logo, width: 44, height: 44, excavate: true, opacity: 1 }
                      : undefined
                  }
                />
              </div>
              <p className="mt-1.5 text-[10px] font-semibold text-muted-foreground">
                Scan with smartphone camera
              </p>
            </div>

            {/* Print Spec Details (Target URL removed) */}
            <div className="mt-2.5 w-full space-y-1 border-t border-border pt-2 text-[11px] text-muted-foreground">
              <div className="flex justify-between">
                <span>Resolution</span>
                <span className="font-semibold text-foreground">{size}&times;{size}px</span>
              </div>
              <div className="flex justify-between">
                <span>Physical Size</span>
                <span className="font-semibold text-foreground">
                  ~{printSizeCm}&times;{printSizeCm}cm ({printSizeInches}&quot;)
                </span>
              </div>
              <div className="flex justify-between">
                <span>Quiet Zone</span>
                <span className="font-semibold text-foreground">
                  {margin} {margin === 1 ? "block" : "blocks"}
                </span>
              </div>
            </div>
          </div>

          {/* Logo Upload Card — moved higher up */}
          <div className="rounded-xl border border-border bg-card p-3 sm:p-3.5 shadow-sm">
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex size-6 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
                  <PiImageBold size={13} />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-primary">Branding</p>
                  <p className="text-xs font-bold text-foreground">Center Logo</p>
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

            {logo ? (
              <div className="flex items-center gap-3 rounded-lg border border-emerald-200 bg-emerald-50 p-2 text-xs text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                <div className="relative size-8 overflow-hidden rounded border border-border bg-white shadow-xs shrink-0">
                  <Image src={logo} alt="Logo preview" fill unoptimized className="object-cover" />
                </div>
                <span className="font-semibold text-[11px]">Logo embedded into QR center.</span>
              </div>
            ) : (
              <label className="group flex h-14 w-full cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/30 transition-colors hover:border-primary/40 hover:bg-primary/5 focus-within:ring-2 focus-within:ring-ring">
                <div className="flex items-center gap-1.5">
                  <PiUploadSimpleBold
                    className="text-muted-foreground transition group-hover:scale-110 group-hover:text-primary"
                    size={16}
                  />
                  <span className="text-xs font-semibold text-muted-foreground">
                    Upload brand logo for QR center
                  </span>
                </div>
                <span className="text-[10px] text-muted-foreground/70">
                  PNG, SVG or JPG (square format recommended)
                </span>
                <input type="file" className="sr-only" accept="image/*" onChange={handleLogoUpload} />
              </label>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function QRGeneratorPage() {
  return (
    <PermissionGuard requiredUnit="qr-assets">
      <QRGeneratorPageContent />
    </PermissionGuard>
  );
}
