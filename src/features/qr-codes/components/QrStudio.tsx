"use client";

import React, { ChangeEvent, useMemo, useRef, useState } from "react";
import { PiArrowCounterClockwiseBold, PiFloppyDiskBold } from "react-icons/pi";
import { PermissionGuard } from "@/components/auth/PermissionGuard";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/button";
import { ConfirmationDialog } from "@/components/ui/ConfirmationDialog";
import { SubTabPills } from "@/components/ui/SubTabPills";
import { toast } from "@/components/ui/toast";
import {
  QR_EDITOR_TABS,
  QR_FRAME_QR_SHARE,
  QR_PRINT_TABLE_TOKEN,
  QR_PRINT_UID_TOKEN,
} from "@/constants/qrCodes.constants";
import type { QrEditorTab, WorkspaceData } from "@/types";
import { useQrDesign } from "../hooks/useQrDesign";
import { activeFrame, brandPalette, qrStyleOf, tableLabel, urlFor } from "../lib/design";
import { downloadPng, downloadSvg, prepareArtwork, printHtml, slugFileName, toSvgString } from "../lib/exportArtwork";
import { readLogoFile } from "../lib/logo";
import { mmToPx, qrPrintedWidthMm, resolvePrintSize } from "../lib/print";
import { buildSheetHtml, sheetCopies } from "../lib/printSheet";
import { buildScanReport } from "../lib/scan";
import { QrArtwork } from "./QrArtwork";
import { QrPrintDialog } from "./QrPrintDialog";
import { QrStage } from "./QrStage";
import { QrFramePanel } from "./panels/QrFramePanel";
import { QrLinkPanel } from "./panels/QrLinkPanel";
import { QrStylePanel } from "./panels/QrStylePanel";
import { QrTextPanel } from "./panels/QrTextPanel";

function QrStudioContent({ workspace }: { workspace: WorkspaceData }) {
  const q = useQrDesign(workspace);
  const { design } = q;
  const f = design.frame;
  const [tab, setTab] = useState<QrEditorTab>("frame");
  const [previewNumber, setPreviewNumber] = useState(1);
  const [confirmDiscard, setConfirmDiscard] = useState(false);
  const [printOpen, setPrintOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const artworkRef = useRef<SVGSVGElement | null>(null);
  const printTemplateRef = useRef<SVGSVGElement | null>(null);

  const businessName = workspace.business?.name?.trim() ?? "";
  const businessType = workspace.theme?.businessType;
  const brand = useMemo(() => brandPalette(workspace.theme), [workspace.theme]);
  const frame = activeFrame(f);
  const layout = frame ? f.layout : "none";
  const printSize = resolvePrintSize(layout, f.printSize);
  const printedQrMm = qrPrintedWidthMm(layout, printSize, QR_FRAME_QR_SHARE[layout]);
  const report = buildScanReport(design, printedQrMm);
  const qrStyle = qrStyleOf(design, urlFor(design.destination, q.urls));
  const slug = workspace.publicSlug ?? "menu";

  const artworkProps = {
    layout,
    frameId: frame?.id ?? "",
    colors: f,
    headline: f.headline,
    subline: f.subline,
    name: f.showName ? businessName : "",
    qr: qrStyle,
    margin: design.margin,
  };

  const exportName = (ext: string) => slugFileName(slug, `${layout === "none" ? "qr" : frame?.id ?? "qr"}-${printSize.id}${f.tableNumbers && layout !== "none" ? `-${previewNumber}` : ""}`, ext);

  const run = async (task: () => Promise<void>, failure: string) => {
    setBusy(true);
    try {
      await task();
    } catch {
      toast.error(failure);
    } finally {
      setBusy(false);
    }
  };

  const handlePng = () =>
    run(async () => {
      if (!artworkRef.current) throw new Error("not ready");
      const { clone, fontCss } = await prepareArtwork(artworkRef.current);
      const [w, h] = [mmToPx(printSize.mm[0]), mmToPx(printSize.mm[1])];
      await downloadPng(toSvgString(clone, String(w), String(h), fontCss), w, h, exportName("png"));
      toast.success(`Downloaded a ${w} × ${h} px PNG`);
    }, "Couldn't create the PNG. Try again, or download the SVG.");

  const handleSvg = () =>
    run(async () => {
      if (!artworkRef.current) throw new Error("not ready");
      const { clone, fontCss } = await prepareArtwork(artworkRef.current);
      downloadSvg(toSvgString(clone, `${printSize.mm[0]}mm`, `${printSize.mm[1]}mm`, fontCss), exportName("svg"));
      toast.success("Downloaded the SVG");
    }, "Couldn't create the SVG. Try again.");

  const handlePrint = (labels: string[]) =>
    run(async () => {
      if (!printTemplateRef.current) throw new Error("not ready");
      const { clone, fontCss } = await prepareArtwork(printTemplateRef.current);
      const template = toSvgString(clone, "100%", "100%");
      const html = buildSheetHtml(sheetCopies(template, labels), layout, printSize, fontCss, `${businessName || slug} QR codes`);
      await printHtml(html);
      setPrintOpen(false);
    }, "Couldn't open the print window. Try again.");

  const handleLogoUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    try {
      q.update({ logo: await readLogoFile(file) });
      toast.success("Logo added");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "We couldn't read that image.");
    }
  };

  return (
    <section className="rounded-lg border border-border bg-card" aria-labelledby="qr-studio-title">
      <ConfirmationDialog
        isOpen={confirmDiscard}
        onClose={() => setConfirmDiscard(false)}
        onConfirm={() => {
          q.discard();
          setConfirmDiscard(false);
        }}
        title="Discard your changes?"
        description="The design goes back to how it was when you last saved."
        confirmLabel="Discard changes"
        tone="default"
      />
      {printOpen ? (
        <QrPrintDialog
          isOpen
          onClose={() => setPrintOpen(false)}
          layout={layout}
          printSize={printSize}
          tableNumbers={f.tableNumbers && layout !== "none"}
          tablePrefix={f.tablePrefix}
          busy={busy}
          onPrint={(labels) => void handlePrint(labels)}
        />
      ) : null}

      <header className="sticky top-0 z-20 flex flex-wrap items-center justify-between gap-3 rounded-t-lg border-b border-border bg-card/95 px-4 py-3 backdrop-blur sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <h2 id="qr-studio-title" className="text-h2 text-foreground">Design and print</h2>
          <Badge tone={q.dirty ? "warning" : "neutral"}>{q.dirty ? "Unsaved changes" : "Saved"}</Badge>
        </div>
        <div className="flex items-center gap-2">
          {q.dirty ? (
            <Button variant="ghost" size="sm" onClick={() => setConfirmDiscard(true)} leftIcon={<PiArrowCounterClockwiseBold className="size-4" />}>
              Discard
            </Button>
          ) : null}
          <Button
            size="sm"
            variant={q.dirty ? "primary" : "secondary"}
            onClick={() => void q.save()}
            loading={q.saving}
            disabled={!q.dirty}
            leftIcon={<PiFloppyDiskBold className="size-4" />}
          >
            Save design
          </Button>
        </div>
      </header>

      <div className="grid gap-8 p-4 sm:p-6 lg:grid-cols-[minmax(0,26rem)_minmax(0,1fr)] xl:grid-cols-[minmax(0,30rem)_minmax(0,1fr)]">
        <div className="lg:sticky lg:top-20 lg:self-start">
          <QrStage
            layout={layout}
            printSize={printSize}
            report={report}
            printedQrMm={printedQrMm}
            busy={busy}
            onLayout={q.setLayout}
            onPrintSize={(printSizeId) => q.updateFrame({ printSize: printSizeId })}
            onDownloadPng={() => void handlePng()}
            onDownloadSvg={() => void handleSvg()}
            onPrintSheet={() => setPrintOpen(true)}
          >
            <QrArtwork ref={artworkRef} {...artworkProps} table={tableLabel(f, previewNumber)} label={`${layout === "none" ? "QR code" : frame?.name ?? "QR code"} preview`} />
          </QrStage>
        </div>

        <div className="min-w-0 space-y-6">
          <SubTabPills options={QR_EDITOR_TABS} active={tab} onChange={setTab} />
          {tab === "frame" ? (
            <QrFramePanel
              design={design}
              businessName={businessName}
              businessType={businessType}
              brand={brand}
              onSelectFrame={q.selectFrame}
              onPalette={q.applyPalette}
              onLayout={q.setLayout}
            />
          ) : tab === "text" ? (
            <QrTextPanel design={design} businessName={businessName} previewNumber={previewNumber} onPreviewNumber={setPreviewNumber} onChange={q.updateFrame} />
          ) : tab === "style" ? (
            <QrStylePanel design={design} onChange={q.update} onLogoUpload={(e) => void handleLogoUpload(e)} />
          ) : (
            <QrLinkPanel destination={design.destination} urls={q.urls} onChange={(destination) => q.update({ destination })} />
          )}
        </div>
      </div>

      {printOpen ? (
        // Off-screen copy for the print sheet: table number and ids are placeholders swapped per copy.
        <div aria-hidden className="pointer-events-none fixed left-[-10000px] top-0 w-[600px]">
          <QrArtwork
            ref={printTemplateRef}
            {...artworkProps}
            uid={QR_PRINT_UID_TOKEN}
            table={f.tableNumbers && layout !== "none" ? tableLabel(f, QR_PRINT_TABLE_TOKEN) : ""}
          />
        </div>
      ) : null}
    </section>
  );
}

/** The QR design studio: pick a frame, set the words and style, then download or print. */
export function QrStudio({ workspace }: { workspace: WorkspaceData }) {
  return (
    <PermissionGuard requiredUnit="qr-assets">
      <QrStudioContent workspace={workspace} />
    </PermissionGuard>
  );
}
