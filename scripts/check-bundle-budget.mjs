// Fails when the gzipped JavaScript a guest's browser downloads for a tenant page grows past its budget.
//
// It measures a RUNNING production server, because only a real response shows what is downloaded
// up front: the route manifests list every chunk a page could ever load (lazy ones included), and
// Next adds a `nomodule` polyfill bundle that modern browsers never fetch. This script requests the
// page like a browser, then sums the gzipped size of the <script src> files in the HTML, skipping
// `nomodule` ones. Chunks loaded later with import() (fingerprint library, Lottie player, animation
// data, framer-motion's animation engine) are not counted — that is the point of lazy loading.
//
// Usage:
//   pnpm build && pnpm start              (in one terminal; add NEXT_DIST_DIR=.next-measure to both
//                                          to build/serve a separate folder)
//   node scripts/check-bundle-budget.mjs [tenantHost] [baseUrl]
//   e.g. node scripts/check-bundle-budget.mjs vimal.localhost:3000 http://localhost:3000
//
// Defaults: tenantHost = $BUNDLE_TENANT_HOST or "vimal.localhost:3100"; baseUrl = $BUNDLE_BASE_URL
// or "http://localhost:3100". The tenant must exist in the database the server talks to.
//
// To change a budget on purpose, edit BUDGETS_KB below in the same PR so the increase is reviewed.
import http from "node:http";
import zlib from "node:zlib";

const tenantHost = process.argv[2] || process.env.BUNDLE_TENANT_HOST || "vimal.localhost:3100";
const baseUrl = new URL(process.argv[3] || process.env.BUNDLE_BASE_URL || "http://localhost:3100");

// Gzipped KB of initial JavaScript. The React + Next.js runtime alone is roughly 170 KB of this, so
// these budgets are set about 5% above what the pages measured when they were last optimised
// (296 KB for a tenant using the Grand Hall layout, 2026-11-24). A site on a different layout
// differs by a few KB.
const BUDGETS_KB = {
  "landing  /": { path: "/", max: 311 },
  "menu     /menu": { path: "/menu", max: 311 },
};

function get(path) {
  return new Promise((resolve, reject) => {
    http
      .get({ host: baseUrl.hostname, port: baseUrl.port, path, headers: { Host: tenantHost } }, (res) => {
        const chunks = [];
        res.on("data", (c) => chunks.push(c));
        res.on("end", () => resolve({ status: res.statusCode, body: Buffer.concat(chunks) }));
      })
      .on("error", reject);
  });
}

let failed = false;
for (const [name, { path, max }] of Object.entries(BUDGETS_KB)) {
  let page;
  try {
    page = await get(path);
  } catch (err) {
    console.error(`✗ ${name}: cannot reach ${baseUrl.origin} (${err.message}). Start the production server first.`);
    failed = true;
    continue;
  }
  if (page.status !== 200) {
    console.error(`✗ ${name}: ${tenantHost}${path} answered ${page.status}. Is the tenant "${tenantHost.split(".")[0]}" in the database?`);
    failed = true;
    continue;
  }

  const tags = [...page.body.toString().matchAll(/<script\b[^>]*\bsrc="([^"]+)"[^>]*>/g)];
  const srcs = [...new Set(tags.filter((m) => !/\bnoModule\b/i.test(m[0])).map((m) => m[1]))];
  let gzip = 0;
  for (const src of srcs) {
    const { body } = await get(src);
    gzip += zlib.gzipSync(body).length;
  }
  const kb = gzip / 1024;
  const ok = kb <= max;
  if (!ok) failed = true;
  console.log(`${ok ? "✓" : "✗"} ${name.padEnd(16)} ${kb.toFixed(1).padStart(6)} KB gzip (budget ${max} KB, ${srcs.length} scripts)`);
}
process.exit(failed ? 1 : 0);
