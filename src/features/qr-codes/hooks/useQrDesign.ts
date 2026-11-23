"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "@/components/ui/toast";
import { workspaceService } from "@/services/workspace.service";
import type { QrDesign, QrFrameMeta, QrFramePalette, QrFrameSettings, QrLayout, WorkspaceData } from "@/types";
import { getApiErrorMessage } from "@/utils/errors";
import { buildPublicLandingUrl, buildPublicMenuUrl } from "@/utils/tenantHost";
import { configFromDesign, designFromConfig, frameById, sameDesign, withPalette } from "../lib/design";
import { resolvePrintSize } from "../lib/print";

function matchesPalette(frame: QrFrameSettings, palettes: QrFramePalette[]): boolean {
  return palettes.some((p) => p.paper === frame.paper && p.ink === frame.ink && p.accent === frame.accent);
}

/** Editor state for the QR page: the design, what was last saved, and the actions on it. */
export function useQrDesign(workspace: WorkspaceData) {
  const slug = workspace.publicSlug;
  const urls = useMemo(() => ({ menu: buildPublicMenuUrl(slug), website: buildPublicLandingUrl(slug) }), [slug]);
  const [saved, setSaved] = useState<QrDesign>(() => designFromConfig(workspace.qrCode, urls));
  const [design, setDesign] = useState<QrDesign>(saved);
  const [saving, setSaving] = useState(false);
  const dirty = !sameDesign(design, saved);

  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  const update = useCallback((patch: Partial<QrDesign>) => setDesign((d) => ({ ...d, ...patch })), []);
  const updateFrame = useCallback(
    (patch: Partial<QrFrameSettings>) => setDesign((d) => ({ ...d, frame: { ...d.frame, ...patch } })),
    [],
  );

  const applyPalette = useCallback((palette: Pick<QrFramePalette, "paper" | "ink" | "accent">) => {
    setDesign((d) => withPalette(d, palette));
  }, []);

  /** Picks a frame and puts on its first palette, so it looks the way it was drawn. */
  const selectFrame = useCallback((frame: QrFrameMeta) => {
    setDesign((d) => {
      const next = { ...d, frame: { ...d.frame, [frame.format === "card" ? "cardId" : "stickerId"]: frame.id } };
      return withPalette(next, frame.palettes[0]);
    });
  }, []);

  const setLayout = useCallback((layout: QrLayout) => {
    setDesign((d) => {
      const next: QrDesign = { ...d, frame: { ...d.frame, layout, printSize: resolvePrintSize(layout, undefined).id } };
      if (layout === "none") return next;
      const frame = frameById(layout === "card" ? next.frame.cardId : next.frame.stickerId);
      return frame && !matchesPalette(next.frame, frame.palettes) ? withPalette(next, frame.palettes[0]) : next;
    });
  }, []);

  const save = useCallback(async () => {
    setSaving(true);
    try {
      await workspaceService.updateWorkspace({ qrCode: configFromDesign(design, urls) });
      setSaved(design);
      toast.success("QR design saved");
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Couldn't save the QR design. Try again."));
    } finally {
      setSaving(false);
    }
  }, [design, urls]);

  const discard = useCallback(() => setDesign(saved), [saved]);

  return { design, urls, dirty, saving, update, updateFrame, applyPalette, selectFrame, setLayout, save, discard };
}
