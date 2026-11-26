import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/** Absolute path of the frontend `src/` folder. */
export const SRC = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');

/**
 * Every non-test, non-declaration `.ts` and `.tsx` file under `src/`,
 * skipping the given top-level folders (and always `tests/`, `test/`, and `node_modules/`).
 */
export function listSourceFiles(skipDirs: string[] = [], dir: string = SRC, out: string[] = []): string[] {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      const rel = path.relative(SRC, full).split(path.sep).join('/');
      if (entry.name === 'tests' || entry.name === 'test' || entry.name === 'node_modules' || skipDirs.includes(rel)) continue;
      listSourceFiles(skipDirs, full, out);
    } else if (
      (entry.name.endsWith('.ts') || entry.name.endsWith('.tsx')) &&
      !entry.name.endsWith('.d.ts') &&
      !entry.name.endsWith('.test.ts') &&
      !entry.name.endsWith('.test.tsx')
    ) {
      out.push(full);
    }
  }
  return out;
}

export const relPath = (file: string): string => path.relative(SRC, file).split(path.sep).join('/');

/** Blank out comments and string/template contents, keeping offsets and newlines intact. */
export function stripNoise(src: string): string {
  let out = '';
  let i = 0;
  const blank = (s: string) => s.replace(/[^\n]/g, ' ');
  while (i < src.length) {
    const c = src[i];
    const n = src[i + 1];
    if (c === '/' && n === '/') {
      const end = src.indexOf('\n', i);
      const stop = end === -1 ? src.length : end;
      out += blank(src.slice(i, stop));
      i = stop;
    } else if (c === '/' && n === '*') {
      const end = src.indexOf('*/', i + 2);
      const stop = end === -1 ? src.length : end + 2;
      out += blank(src.slice(i, stop));
      i = stop;
    } else if (c === "'" || c === '"' || c === '`') {
      let j = i + 1;
      while (j < src.length && src[j] !== c) j += src[j] === '\\' ? 2 : 1;
      out += c + blank(src.slice(i + 1, j)) + c;
      i = j + 1;
    } else {
      out += c;
      i++;
    }
  }
  return out;
}

/** Blank out `declare global { ... }` / `declare module '...' { ... }` blocks (brace-balanced). */
export function stripAmbient(src: string): string {
  const re = /\bdeclare\s+(?:global|module\b[^{]*)\s*\{/g;
  let m: RegExpExecArray | null;
  let result = src;
  while ((m = re.exec(result))) {
    let depth = 0;
    let end = m.index + m[0].length - 1;
    for (; end < result.length; end++) {
      if (result[end] === '{') depth++;
      else if (result[end] === '}' && --depth === 0) break;
    }
    result = result.slice(0, m.index) + result.slice(m.index, end + 1).replace(/[^\n]/g, ' ') + result.slice(end + 1);
    re.lastIndex = m.index;
  }
  return result;
}

/** 1-based line number of a character offset. */
export const lineAt = (text: string, offset: number): number => text.slice(0, offset).split('\n').length;
