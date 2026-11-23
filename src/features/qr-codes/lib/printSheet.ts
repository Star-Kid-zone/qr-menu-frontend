import { QR_PRINT_SHEET, QR_PRINT_TABLE_TOKEN, QR_PRINT_UID_TOKEN } from '@/constants/qrCodes.constants';
import type { QrLayout, QrPrintSize } from '@/types';
import { sheetLayout } from './print';

/** One copy per label: the template's id prefix and table placeholder swapped in. */
export function sheetCopies(template: string, labels: string[]): string[] {
  return labels.map((label, i) =>
    template.split(QR_PRINT_UID_TOKEN).join(`c${i}`).split(QR_PRINT_TABLE_TOKEN).join(label),
  );
}

/** Table numbers from..to, clamped to the sheet maximum. */
export function tableRange(from: number, to: number): string[] {
  const start = Math.max(1, Math.floor(Math.min(from, to)));
  const end = Math.min(Math.floor(Math.max(from, to)), start + QR_PRINT_SHEET.maxCopies - 1);
  return Array.from({ length: end - start + 1 }, (_, i) => String(start + i));
}

/** A4 pages of copies at true size. Cards tile edge to edge with light cut guides. */
export function buildSheetHtml(copies: string[], layout: QrLayout, size: QrPrintSize, fontCss: string, title: string): string {
  const { columns, rows } = sheetLayout(layout, size);
  const perPage = columns * rows;
  const [pageW, pageH] = QR_PRINT_SHEET.pageMm;
  const { gapMm } = layout === 'card' ? QR_PRINT_SHEET.card : QR_PRINT_SHEET.loose;
  const [w, h] = size.mm;
  const pages: string[] = [];
  for (let i = 0; i < copies.length; i += perPage) {
    const cells = copies.slice(i, i + perPage).map((svg) => `<div class="cell">${svg}</div>`).join('');
    pages.push(`<section class="page">${cells}</section>`);
  }
  const safeTitle = title.replace(/[<>&"]/g, '');
  return `<!doctype html><html><head><meta charset="utf-8"><title>${safeTitle}</title>
<style>${fontCss}</style>
<style>
@page { size: A4 portrait; margin: 0; }
* { box-sizing: border-box; }
html, body { margin: 0; padding: 0; background: #fff; }
.page { width: ${pageW}mm; height: ${pageH}mm; display: grid; grid-template-columns: repeat(${columns}, ${w}mm);
  grid-auto-rows: ${h}mm; gap: ${gapMm}mm; justify-content: center; align-content: center; break-after: page; overflow: hidden; }
.page:last-child { break-after: auto; }
.cell { width: ${w}mm; height: ${h}mm; ${layout === 'card' ? 'outline: 0.2mm dashed #c8c8c8; outline-offset: -0.1mm;' : ''} }
.cell svg { display: block; width: 100%; height: 100%; }
</style></head><body>${pages.join('')}</body></html>`;
}
