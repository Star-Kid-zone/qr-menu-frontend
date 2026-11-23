import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { listSourceFiles, relPath, stripNoise, stripAmbient, lineAt, SRC } from './helpers/sourceScan.js';

/**
 * Type-location rule (AGENTS.md §2F):
 * Core fullstack architectural tiers (services, utils, constants, config, UI primitives)
 * must declare no interface, type alias, or custom types. All domain models, API envelopes,
 * and primitive types live in `src/types/`.
 *
 * Allowed outside `src/types/`: `.d.ts` files, test files, and ambient augmentations.
 */

const RULES: Array<{ label: string; re: RegExp }> = [
  { label: 'interface declaration', re: /(^|[\s;{}])(?:export\s+)?(?:declare\s+)?interface\s+[A-Za-z_$][\w$]*/g },
  { label: 'type alias declaration', re: /(^|[\s;{}])(?:export\s+)?(?:declare\s+)?type\s+[A-Za-z_$][\w$]*\s*(?:<[^=]*>)?\s*=/g },
];

function findViolations(file: string): string[] {
  const clean = stripAmbient(stripNoise(fs.readFileSync(file, 'utf8')));
  const found: string[] = [];
  for (const { label, re } of RULES) {
    re.lastIndex = 0;
    let m: RegExpExecArray | null;
    while ((m = re.exec(clean))) {
      const lineStart = Math.max(0, clean.lastIndexOf('\n', m.index));
      const lineStr = clean.slice(lineStart, m.index + m[0].length);
      if (lineStr.includes('import') || lineStr.includes('export type {')) continue;
      found.push(`${relPath(file)}:${lineAt(clean, m.index + (m[1]?.length ?? 0))} ${label}`);
    }
  }
  return found;
}

const SCAN_TIMEOUT_MS = 60_000;

describe('frontend type location', () => {
  it('declares no interface or type alias in services/', () => {
    const files = listSourceFiles().filter((f) => relPath(f).startsWith('services/'));
    const violations = files.flatMap(findViolations);
    expect(violations, `Move these into src/types/:\n${violations.join('\n')}`).toEqual([]);
  }, SCAN_TIMEOUT_MS);

  it('declares no interface or type alias in utils/', () => {
    const files = listSourceFiles().filter((f) => relPath(f).startsWith('utils/'));
    const violations = files.flatMap(findViolations);
    expect(violations, `Move these into src/types/:\n${violations.join('\n')}`).toEqual([]);
  }, SCAN_TIMEOUT_MS);

  it('declares no interface or type alias in constants/', () => {
    const files = listSourceFiles().filter((f) => relPath(f).startsWith('constants/'));
    const violations = files.flatMap(findViolations);
    expect(violations, `Move these into src/types/:\n${violations.join('\n')}`).toEqual([]);
  }, SCAN_TIMEOUT_MS);

  it('declares no interface or type alias in config/', () => {
    const files = listSourceFiles().filter((f) => relPath(f).startsWith('config/'));
    const violations = files.flatMap(findViolations);
    expect(violations, `Move these into src/types/:\n${violations.join('\n')}`).toEqual([]);
  }, SCAN_TIMEOUT_MS);

  it('declares no interface or type alias in components/ui/ (centralized in src/types/ui/)', () => {
    const files = listSourceFiles().filter((f) => relPath(f).startsWith('components/ui/'));
    const violations = files.flatMap(findViolations);
    expect(violations, `Move these into src/types/ui/:\n${violations.join('\n')}`).toEqual([]);
  }, SCAN_TIMEOUT_MS);
});
