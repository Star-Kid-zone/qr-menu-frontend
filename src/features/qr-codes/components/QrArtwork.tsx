"use client";

import React, { forwardRef, useId } from "react";
import { QR_FRAME_VIEWBOX } from "@/constants/qrCodes.constants";
import type { QrFrameColors, QrLayout, QrSlot, QrStyle } from "@/types";
import { frameRenderer } from "../frames";
import { QrCodeMark, QrGlyph } from "./QrCodeMark";

interface QrArtworkProps {
  layout: QrLayout;
  frameId: string;
  colors: QrFrameColors;
  headline: string;
  subline: string;
  name: string;
  table: string;
  qr: QrStyle;
  /** Quiet zone for the bare code (layout "none"). */
  margin: number;
  /** Fixed id prefix (print sheets swap it per copy); defaults to a React id. */
  uid?: string;
  /** Draw a stand-in code: for the frame gallery. */
  thumbnail?: boolean;
  className?: string;
  label?: string;
}

/**
 * The printed piece as one SVG: frame artwork with the live QR in its slot.
 * The same element is shown on screen and serialised for downloads.
 */
export const QrArtwork = forwardRef<SVGSVGElement, QrArtworkProps>(function QrArtwork(
  { layout, frameId, colors, headline, subline, name, table, qr, margin, uid, thumbnail = false, className, label = "QR code preview" },
  ref,
) {
  const reactId = useId();
  const id = uid ?? `qr${reactId.replace(/[^a-zA-Z0-9]/g, "")}`;
  const Frame = layout === "none" ? null : frameRenderer(frameId);
  const [w, h] = QR_FRAME_VIEWBOX[Frame ? layout : "none"];

  const slot: QrSlot = (x, y, size, options) => {
    const radius = options?.radius ?? 12;
    const pad = options?.pad ?? Math.round(size * 0.075);
    return (
      <g>
        <rect x={x} y={y} width={size} height={size} rx={radius} fill={qr.backgroundFill} />
        {thumbnail ? (
          <QrGlyph style={qr} x={x + pad} y={y + pad} size={size - pad * 2} />
        ) : (
          <QrCodeMark style={qr} x={x + pad} y={y + pad} size={size - pad * 2} transparent />
        )}
      </g>
    );
  };

  return (
    <svg
      ref={ref}
      viewBox={`0 0 ${w} ${h}`}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={label}
      className={className}
    >
      {Frame ? (
        <Frame uid={id} colors={colors} headline={headline} subline={subline} name={name} table={table} qr={slot} />
      ) : thumbnail ? (
        <>
          <rect width={w} height={h} fill={qr.backgroundFill} />
          <QrGlyph style={qr} x={60} y={60} size={w - 120} />
        </>
      ) : (
        <QrCodeMark style={qr} x={0} y={0} size={w} margin={margin} />
      )}
    </svg>
  );
});
