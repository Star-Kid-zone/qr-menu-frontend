import { MM_PER_INCH, QR_EXPORT_DPI, QR_PRINT_SHEET, QR_PRINT_SIZES } from '@/constants/qrCodes.constants';
import type { QrLayout, QrPrintSheetLayout, QrPrintSize } from '@/types';

export function mmToPx(mm: number, dpi: number = QR_EXPORT_DPI): number {
  return Math.round((mm / MM_PER_INCH) * dpi);
}

/** The saved print size for this layout, or the layout's first size. */
export function resolvePrintSize(layout: QrLayout, id: string | undefined): QrPrintSize {
  const sizes = QR_PRINT_SIZES[layout];
  return sizes.find((s) => s.id === id) ?? sizes[0];
}

/** How many copies fit on one A4 sheet. Cards tile edge to edge; stickers and bare codes get a gap. */
export function sheetLayout(layout: QrLayout, size: QrPrintSize): QrPrintSheetLayout {
  const [pageW, pageH] = QR_PRINT_SHEET.pageMm;
  const { gapMm, marginMm } = layout === 'card' ? QR_PRINT_SHEET.card : QR_PRINT_SHEET.loose;
  const fit = (page: number, cell: number) => Math.max(1, Math.floor((page - 2 * marginMm + gapMm) / (cell + gapMm)));
  return { columns: fit(pageW, size.mm[0]), rows: fit(pageH, size.mm[1]) };
}

/** Physical width of the QR itself inside a printed piece, in mm. */
export function qrPrintedWidthMm(layout: QrLayout, size: QrPrintSize, qrShareOfWidth: number): number {
  return layout === 'none' ? size.mm[0] : size.mm[0] * qrShareOfWidth;
}
