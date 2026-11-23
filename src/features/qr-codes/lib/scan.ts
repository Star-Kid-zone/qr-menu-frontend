import { QR_FANCY_DOT_STYLES, QR_SCAN_RULES } from '@/constants/qrCodes.constants';
import type { QrDesign, QrScanIssue, QrScanReport } from '@/types';
import { contrastRatio, luminance } from './color';

/**
 * Checks that decide whether a printed code will scan. Everything here is a
 * known cause of failed scans: low contrast, light-on-dark, tiny prints,
 * a missing quiet zone and decorative dot shapes.
 */
export function buildScanReport(design: QrDesign, printedQrMm: number): QrScanReport {
  const issues: QrScanIssue[] = [];
  const bg = design.backgroundFill;

  const dots = contrastRatio(design.dataColor, bg);
  const eyes = contrastRatio(design.finderColor, bg);
  const weakest = Math.min(dots, eyes);
  if (weakest < QR_SCAN_RULES.minContrast) {
    issues.push({ tone: 'bad', message: 'The dots and the background are too close in colour for cameras to read.' });
  } else if (weakest < QR_SCAN_RULES.goodContrast) {
    issues.push({ tone: 'warn', message: 'Contrast is a little low. Darker dots or a lighter background scan more reliably.' });
  }

  if (luminance(design.dataColor) > luminance(bg)) {
    issues.push({ tone: 'warn', message: 'Light dots on a dark background fail on some phone cameras. Use dark dots on a light background.' });
  }

  if (QR_FANCY_DOT_STYLES.includes(design.dataPattern)) {
    issues.push({ tone: 'warn', message: 'Decorative dot shapes are harder to read. Test a print with a few phones first.' });
  }

  if (design.frame.layout === 'none' && design.margin < QR_SCAN_RULES.minQuietZone) {
    issues.push({ tone: 'warn', message: 'Leave a border of at least 2 blocks around the code so cameras can find its edge.' });
  }

  if (printedQrMm < QR_SCAN_RULES.minPrintMm) {
    issues.push({ tone: 'warn', message: 'The printed code is under 2 cm wide. Pick a bigger print size.' });
  }

  const tone = issues.some((i) => i.tone === 'bad') ? 'bad' : issues.length ? 'warn' : 'good';
  return { tone, issues };
}

/** Roughly how far away a code of this width can be scanned, in cm. */
export function scanDistanceCm(printedQrMm: number): number {
  return Math.round((printedQrMm * QR_SCAN_RULES.scanDistanceFactor) / 10);
}
