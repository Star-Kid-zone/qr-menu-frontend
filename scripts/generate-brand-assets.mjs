#!/usr/bin/env node
/**
 * Generates every FeastOwl brand file from the owl geometry in
 * src/constants/brand.constants.ts, so icons never drift from the in-app logo.
 *
 *   node scripts/generate-brand-assets.mjs        (run from the frontend folder)
 *
 * Writes public/brand/* and public/favicon.ico. Renders PNGs with the
 * satori/resvg build bundled in Next (next/og), so it needs no extra package.
 * Downloads the Fraunces and Plus Jakarta Sans fonts from Google Fonts for the
 * wordmark and tagline. Re-run it whenever the mark or colours change.
 */
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import React from 'react';
import { ImageResponse } from 'next/dist/compiled/@vercel/og/index.node.js';
import {
  BRAND_COLORS as C,
  OWL_BEAK_PATH,
  OWL_BODY_PATH,
  OWL_PALETTES,
  OWL_PUPILS_PATH,
  OWL_RINGS_PATH,
  BRAND_OG_IMAGE,
} from '../src/constants/brand.constants.ts';
import { APP_NAME, DEFAULT_APP_DESCRIPTION, DEFAULT_TENANT_ROOT_DOMAIN } from '../src/constants/app.constants.ts';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PUBLIC = path.join(ROOT, 'public');
const BRAND = path.join(PUBLIC, 'brand');
const h = React.createElement;

// ── SVG sources ──────────────────────────────────────────────────────────────

function owlSvg(variant, { tileRadius = 28, scale = 0.84, bleed = false } = {}) {
  if (variant === 'mono') {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128"><path fill="${C.ink}" fill-rule="evenodd" d="${OWL_BODY_PATH} ${OWL_RINGS_PATH} ${OWL_PUPILS_PATH} ${OWL_BEAK_PATH}"/></svg>`;
  }
  const p = OWL_PALETTES[variant];
  const tile = p.tile ? `<rect width="128" height="128" rx="${bleed ? 0 : tileRadius}" fill="${p.tile}"/>` : '';
  const transform = p.tile ? ` transform="translate(64 66) scale(${scale}) translate(-64 -65)"` : '';
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">${tile}<g${transform}>` +
    `<path fill="${p.body}" d="${OWL_BODY_PATH}"/>` +
    `<path fill="${p.ring}" fill-rule="evenodd" d="${OWL_RINGS_PATH}"/>` +
    `<path fill="${p.pupil}" d="${OWL_PUPILS_PATH}"/>` +
    `<path fill="${p.beak}" d="${OWL_BEAK_PATH}"/>` +
    `</g></svg>`
  );
}

const dataUri = (svg) => `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
const img = (svg, size) => h('img', { src: dataUri(svg), width: size, height: size, style: { width: size, height: size } });

// ── Fonts ────────────────────────────────────────────────────────────────────

async function googleFont(family, axes) {
  const css = await (await fetch(`https://fonts.googleapis.com/css2?family=${family}:${axes}`)).text();
  const url = css.match(/src:\s*url\(([^)]+\.ttf)\)/)?.[1];
  if (!url) throw new Error(`No TTF for ${family}`);
  return (await fetch(url)).arrayBuffer();
}

// ── Rendering ────────────────────────────────────────────────────────────────

let fonts = [];
async function png(element, width, height) {
  const res = new ImageResponse(element, { width, height, fonts });
  return Buffer.from(await res.arrayBuffer());
}

/** ICO container holding PNG images (supported by every current browser). */
function ico(pngs) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(pngs.length, 4);
  let offset = 6 + 16 * pngs.length;
  const entries = pngs.map(({ size, data }) => {
    const e = Buffer.alloc(16);
    e.writeUInt8(size >= 256 ? 0 : size, 0);
    e.writeUInt8(size >= 256 ? 0 : size, 1);
    e.writeUInt16LE(1, 4);
    e.writeUInt16LE(32, 6);
    e.writeUInt32LE(data.length, 8);
    e.writeUInt32LE(offset, 12);
    offset += data.length;
    return e;
  });
  return Buffer.concat([header, ...entries, ...pngs.map((p) => p.data)]);
}

function wordmark(fontSize, onDark) {
  return h(
    'div',
    { style: { display: 'flex', fontFamily: 'Fraunces', fontWeight: 700, fontSize, letterSpacing: -fontSize * 0.01, color: onDark ? C.chalk : C.ink } },
    h('span', null, 'Feast'),
    h('span', { style: { color: onDark ? C.saffron : C.aubergine } }, 'Owl'),
  );
}

function logo(width, height, { onDark = false, background = 'transparent' } = {}) {
  const mark = Math.round(height * 0.78);
  return h(
    'div',
    { style: { width, height, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: Math.round(height * 0.14), background } },
    img(owlSvg(onDark ? 'reversed' : 'color'), mark),
    wordmark(Math.round(height * 0.5), onDark),
  );
}

function ogCard() {
  const { width, height } = BRAND_OG_IMAGE;
  return h(
    'div',
    {
      style: {
        width, height, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 88px', background: `linear-gradient(135deg, ${C.plum} 0%, ${C.plumDeep} 100%)`, fontFamily: 'Jakarta',
      },
    },
    h(
      'div',
      { style: { display: 'flex', flexDirection: 'column', maxWidth: 640 } },
      wordmark(96, true),
      h('div', { style: { marginTop: 28, fontSize: 38, lineHeight: 1.35, color: C.chalk, opacity: 0.88 } }, DEFAULT_APP_DESCRIPTION),
      h('div', { style: { marginTop: 40, fontSize: 30, fontWeight: 600, color: C.saffron } }, DEFAULT_TENANT_ROOT_DOMAIN),
    ),
    img(owlSvg('reversed'), 360),
  );
}

// ── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  await mkdir(BRAND, { recursive: true });
  fonts = [
    { name: 'Fraunces', data: await googleFont('Fraunces', 'opsz,wght,SOFT@144,700,100'), weight: 700, style: 'normal' },
    { name: 'Jakarta', data: await googleFont('Plus+Jakarta+Sans', 'wght@500'), weight: 500, style: 'normal' },
    { name: 'Jakarta', data: await googleFont('Plus+Jakarta+Sans', 'wght@600'), weight: 600, style: 'normal' },
  ];

  const files = {
    // Vector masters
    'brand/feastowl-mark.svg': owlSvg('color'),
    'brand/feastowl-mark-reversed.svg': owlSvg('reversed'),
    'brand/feastowl-mark-mono.svg': owlSvg('mono'),
    'brand/feastowl-icon.svg': owlSvg('tile'),
  };
  for (const [rel, svg] of Object.entries(files)) await writeFile(path.join(PUBLIC, rel), `${svg}\n`);

  const square = (svg, size) => png(img(svg, size), size, size);
  const tile = owlSvg('tile');

  const out = {
    'brand/icon-192.png': await square(tile, 192),
    'brand/icon-512.png': await square(tile, 512),
    // Android crops maskable icons to a circle: full-bleed tile, owl inside the safe zone.
    'brand/icon-maskable-512.png': await square(owlSvg('tile', { bleed: true, scale: 0.6 }), 512),
    // iOS rounds the corners itself and shows transparency as black.
    'brand/apple-touch-icon.png': await square(owlSvg('tile', { bleed: true, scale: 0.72 }), 180),
    'brand/feastowl-logo.png': await png(logo(960, 300), 960, 300),
    'brand/feastowl-logo-reversed.png': await png(logo(960, 300, { onDark: true }), 960, 300),
    // Emails: shown at 160×50; white background because many clients drop transparency.
    'brand/feastowl-email-logo.png': await png(logo(320, 100, { background: '#FFFFFF' }), 320, 100),
    'brand/feastowl-og.png': await png(ogCard(), BRAND_OG_IMAGE.width, BRAND_OG_IMAGE.height),
  };
  for (const [rel, data] of Object.entries(out)) await writeFile(path.join(PUBLIC, rel), data);

  const favicons = [];
  for (const size of [16, 32, 48]) favicons.push({ size, data: await square(tile, size) });
  await writeFile(path.join(PUBLIC, 'favicon.ico'), ico(favicons));

  console.log(`${APP_NAME} brand assets written:`);
  for (const rel of [...Object.keys(files), ...Object.keys(out), 'favicon.ico']) console.log(`  public/${rel}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
