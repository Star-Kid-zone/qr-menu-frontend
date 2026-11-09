"use client";

import React, { useCallback, useEffect, useRef, useState, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import type { DownloadFileFormat, ReactQRCodeRef } from "@lglab/react-qr-code";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/PageHeader";
import { toast } from "@/components/ui/toast";
import {
  PiDownloadSimpleBold,
  PiFloppyDiskBold,
} from "react-icons/pi";
import { buildPublicLandingUrl, buildPublicMenuUrl } from "@/utils/tenantHost";
import {
  workspaceService,
  type WorkspaceQrCodeConfig,
  type WorkspaceData,
} from "@/services/workspace.service";
import { getApiErrorMessage } from "@/utils/errors";
import { QrDesignPanel } from "./QrDesignPanel";
import { PermissionGuard } from "@/components/auth/PermissionGuard";
import {
  defaultQrConfig,
  RANDOM_COLOR_PRESETS,
  type DataModuleStyle,
  type FinderPatternStyle,
} from "../types";
import { QrDestinationCard } from "./QrDestinationCard";
import { QrResolutionCard } from "./QrResolutionCard";
import { QrAestheticsCard } from "./QrAestheticsCard";
import { QrPreviewCard } from "./QrPreviewCard";

function QrGeneratorPageContent({ embedded = false }: { embedded?: boolean }) {
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
  const showControls = !embedded;

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
    return () => {
      mounted = false;
    };
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
      toast.success("QR design saved");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Couldn't save the QR design. Try again."));
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

  const controls = (
    <>
      <QrDestinationCard
        qrValue={qrValue}
        setQrValue={setQrValue}
        landingUrl={landingUrl}
        menuUrl={menuUrl}
      />
      <QrResolutionCard
        size={size}
        setSize={setSize}
        margin={margin}
        setMargin={setMargin}
        printSizeCm={printSizeCm}
        printSizeInches={printSizeInches}
      />
      <QrAestheticsCard
        moduleStyle={moduleStyle}
        setModuleStyle={setModuleStyle}
        moduleColor={moduleColor}
        setModuleColor={setModuleColor}
        finderStyle={finderStyle}
        setFinderStyle={setFinderStyle}
        finderColor={finderColor}
        setFinderColor={setFinderColor}
        bgColor={bgColor}
        setBgColor={setBgColor}
        onRandomizeColors={handleRandomizeColors}
      />
    </>
  );

  const actions = (
          <div className="flex flex-wrap items-center gap-2">
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
            {showControls ? (
              <Button
                size="sm"
                onClick={handleSave}
                loading={saving}
                disabled={loading}
                leftIcon={<PiFloppyDiskBold size={14} />}
              >
                Save design
              </Button>
            ) : null}
          </div>
  );

  if (embedded) {
    return (
      <section className="grid gap-8 rounded-lg border border-border bg-card p-6 lg:grid-cols-[16rem_1fr]">
        <div className="sticky top-0 z-10 -mx-6 -mt-6 flex items-center gap-4 rounded-t-lg border-b border-border bg-card p-4 lg:top-6 lg:m-0 lg:flex-col lg:self-start lg:rounded-none lg:border-0 lg:p-0">
          <QrPreviewCard
            ref={ref}
            qrValue={qrValue}
            size={size}
            margin={margin}
            bgColor={bgColor}
            moduleStyle={moduleStyle}
            moduleColor={moduleColor}
            finderStyle={finderStyle}
            finderColor={finderColor}
            logo={logo}
            setLogo={setLogo}
            printSizeCm={printSizeCm}
            printSizeInches={printSizeInches}
            onLogoUpload={handleLogoUpload}
            compact
          />
          <div className="flex min-w-0 flex-1 flex-col gap-2 lg:w-full lg:flex-none">
            <Button
              onClick={() => handleDownload("png")}
              disabled={loading}
              leftIcon={<PiDownloadSimpleBold size={16} />}
            >
              Download PNG
            </Button>
            <Button variant="secondary" onClick={() => handleDownload("svg")} disabled={loading}>
              Download SVG
            </Button>
          </div>
        </div>

        <div className="min-w-0 space-y-6">
          <div>
            <h2 className="text-h2 text-foreground">Your QR code</h2>
            <p className="mt-1 text-body text-muted-foreground">
              Print it and place it on your tables. Change how it looks below, then save.
            </p>
          </div>
          <QrDesignPanel
            moduleStyle={moduleStyle}
            setModuleStyle={setModuleStyle}
            moduleColor={moduleColor}
            setModuleColor={setModuleColor}
            finderStyle={finderStyle}
            setFinderStyle={setFinderStyle}
            finderColor={finderColor}
            setFinderColor={setFinderColor}
            bgColor={bgColor}
            setBgColor={setBgColor}
            size={size}
            setSize={setSize}
            logo={logo}
            setLogo={setLogo}
            onLogoUpload={handleLogoUpload}
            landingUrl={landingUrl}
            menuUrl={menuUrl}
            qrValue={qrValue}
            setQrValue={setQrValue}
          />
          <div className="flex flex-wrap items-center gap-3 border-t border-border pt-5">
            <Button onClick={() => void handleSave()} loading={saving} disabled={loading} leftIcon={<PiFloppyDiskBold size={16} />}>
              Save design
            </Button>
            <Button
              variant="ghost"
              disabled={loading}
              onClick={() => applyConfig(undefined, workspace?.publicSlug)}
            >
              Reset
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <div className={embedded ? "flex flex-col gap-4" : "flex h-full min-h-0 flex-col gap-4 overflow-hidden"}>
      {embedded ? (
        // Inside the QR menu page: a section under the web address.
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-h2 text-foreground">Your QR code</h2>
            <p className="mt-1 text-body text-muted-foreground">
              Download it and print it for your tables. Guests scan it to open your menu.
            </p>
          </div>
          {actions}
        </div>
      ) : (
        <PageHeader
          title="QR codes"
          description="Design and download the codes for your tables."
          onBack={() => router.push("/admin/home")}
          backLabel="Home"
          actions={actions}
        />
      )}

      {/* Body: two columns. Standalone: no page scroll; embedded: natural height. */}
      <div className={embedded ? "grid grid-cols-1 gap-4 lg:grid-cols-12" : "grid min-h-0 flex-1 grid-cols-1 gap-4 overflow-hidden lg:grid-cols-12 pb-4"}>
        {/* LEFT COLUMN: controls */}
        {showControls ? (
          <div className="min-h-0 overflow-y-auto lg:col-span-7 xl:col-span-8 space-y-3 pr-1">
            {controls}
          </div>
        ) : null}

        {/* RIGHT COLUMN: Live Preview + Logo Upload */}
        <QrPreviewCard
          ref={ref}
          qrValue={qrValue}
          size={size}
          margin={margin}
          bgColor={bgColor}
          moduleStyle={moduleStyle}
          moduleColor={moduleColor}
          finderStyle={finderStyle}
          finderColor={finderColor}
          logo={logo}
          setLogo={setLogo}
          printSizeCm={printSizeCm}
          printSizeInches={printSizeInches}
          onLogoUpload={handleLogoUpload}
          compact={embedded}
        />
      </div>

    </div>
  );
}

export function QrGeneratorPage({ embedded = false }: { embedded?: boolean }) {
  return (
    <PermissionGuard requiredUnit="qr-assets">
      <QrGeneratorPageContent embedded={embedded} />
    </PermissionGuard>
  );
}
