"use client";

import { forwardRef, useImperativeHandle, useRef, type CSSProperties } from "react";
import type { PosterDecoration, PosterTemplateConfig } from "@/types/marketing";

export interface PosterCanvasHandle {
  /** Reads the current (possibly uncommitted-to-state, but live-in-DOM) text of every field. */
  getValues: () => Record<string, string>;
  /** Reverts every field back to the template's default text. */
  reset: () => void;
}

interface PosterCanvasProps {
  config: PosterTemplateConfig;
  /** Initial text per field id — falls back to the template's defaultText when absent. */
  initialValues?: Record<string, string>;
  /** When true, fields become in-place editable (click to type). */
  editable?: boolean;
  /** Rendered width in px — height is derived from the template's aspect ratio. */
  renderWidth: number;
}

function DecorationEl({ decoration }: { decoration: PosterDecoration }) {
  if (decoration.type === "rect") {
    return (
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          left: `${decoration.xPct}%`,
          top: `${decoration.yPct}%`,
          width: `${decoration.widthPct}%`,
          height: `${decoration.heightPct}%`,
          background: decoration.color,
          borderRadius: decoration.borderRadiusPct ? `${decoration.borderRadiusPct}%` : undefined,
          opacity: decoration.opacity ?? 1,
          transform: decoration.rotateDeg ? `rotate(${decoration.rotateDeg}deg)` : undefined,
        }}
      />
    );
  }

  if (decoration.type === "circle") {
    return (
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          left: `${decoration.xPct}%`,
          top: `${decoration.yPct}%`,
          width: `${decoration.sizePct}%`,
          aspectRatio: "1 / 1",
          background: decoration.color,
          borderRadius: "9999px",
          opacity: decoration.opacity ?? 1,
        }}
      />
    );
  }

  if (decoration.type === "line") {
    return (
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          left: `${decoration.xPct}%`,
          top: `${decoration.yPct}%`,
          width: `${decoration.widthPct}%`,
          height: `${decoration.thicknessPx ?? 2}px`,
          background: decoration.color,
          transform: decoration.rotateDeg ? `rotate(${decoration.rotateDeg}deg)` : undefined,
        }}
      />
    );
  }

  const Icon = decoration.icon;
  return (
    <Icon
      aria-hidden="true"
      style={{
        position: "absolute",
        left: `${decoration.xPct}%`,
        top: `${decoration.yPct}%`,
        width: `${decoration.sizePct}%`,
        height: `${decoration.sizePct}%`,
        color: decoration.color,
        opacity: decoration.opacity ?? 1,
      }}
    />
  );
}

/**
 * Renders a poster template — background + fixed decorations + text fields.
 * In editable mode, only the text fields become editable (contentEditable);
 * everything else (images, shapes, layout) is locked, matching the "pick a
 * template, edit only the words" product requirement.
 *
 * Text is intentionally NOT a React-controlled value: committing every
 * keystroke to state would fight the browser's caret position inside
 * contentEditable. Instead the DOM is the source of truth while editing —
 * `getValues()` reads it directly (also what a screenshot/export sees).
 */
export const PosterCanvas = forwardRef<PosterCanvasHandle, PosterCanvasProps>(function PosterCanvas(
  { config, initialValues, editable = false, renderWidth },
  forwardedRef,
) {
  const rootRef = useRef<HTMLDivElement>(null);
  const height = renderWidth * (config.height / config.width);

  useImperativeHandle(forwardedRef, () => ({
    getValues: () => {
      const root = rootRef.current;
      const values: Record<string, string> = {};
      config.textFields.forEach((field) => {
        const el = root?.querySelector<HTMLElement>(`[data-field-id="${field.id}"]`);
        values[field.id] = el?.textContent ?? initialValues?.[field.id] ?? field.defaultText;
      });
      return values;
    },
    reset: () => {
      const root = rootRef.current;
      config.textFields.forEach((field) => {
        const el = root?.querySelector<HTMLElement>(`[data-field-id="${field.id}"]`);
        if (el) el.textContent = field.defaultText;
      });
    },
  }));

  const backgroundStyle: CSSProperties =
    config.background.type === "gradient"
      ? { backgroundImage: config.background.value }
      : { backgroundColor: config.background.value };

  return (
    <div
      ref={rootRef}
      className="relative select-none overflow-hidden"
      style={{ width: renderWidth, height, ...backgroundStyle }}
    >
      {config.decorations.map((decoration, index) => (
        <DecorationEl key={index} decoration={decoration} />
      ))}

      {config.textFields.map((field) => {
        const text = initialValues?.[field.id] ?? field.defaultText;
        const fontSize = (field.fontSizePct / 100) * renderWidth;
        const style: CSSProperties = {
          position: "absolute",
          left: `${field.xPct}%`,
          top: `${field.yPct}%`,
          width: `${field.widthPct}%`,
          fontSize,
          fontWeight: field.fontWeight,
          color: field.color,
          textAlign: field.align,
          fontFamily: field.fontFamily,
          lineHeight: field.lineHeight ?? 1.2,
          textTransform: field.textTransform,
          letterSpacing: field.letterSpacingPx ? `${field.letterSpacingPx}px` : undefined,
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
          outline: "none",
        };

        if (!editable) {
          return (
            <div key={field.id} data-field-id={field.id} style={style}>
              {text}
            </div>
          );
        }

        return (
          <div
            key={field.id}
            data-field-id={field.id}
            style={style}
            contentEditable
            suppressContentEditableWarning
            role="textbox"
            aria-label={field.label}
            className="cursor-text rounded-sm transition-shadow duration-150 hover:ring-2 hover:ring-primary/40 focus:ring-2 focus:ring-primary focus:outline-none"
            onInput={(e) => {
              const el = e.currentTarget;
              if (field.maxLength && (el.textContent?.length ?? 0) > field.maxLength) {
                el.textContent = (el.textContent ?? "").slice(0, field.maxLength);
                const range = document.createRange();
                range.selectNodeContents(el);
                range.collapse(false);
                const selection = window.getSelection();
                selection?.removeAllRanges();
                selection?.addRange(range);
              }
            }}
          >
            {text}
          </div>
        );
      })}
    </div>
  );
});
