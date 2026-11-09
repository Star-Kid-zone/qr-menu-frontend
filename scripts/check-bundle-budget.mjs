// Fails when the gzipped client JS that guests download on a public route grows past its budget.
// Run after `next build`. Sizes come from each route's client-reference manifest (the chunk list
// Next.js emits for that route), so the number tracks what the page actually pulls in.
//
// To change a budget on purpose, edit BUDGETS below in the same PR so the increase is reviewed.
import fs from "node:fs";
import zlib from "node:zlib";

const BUDGETS_KB = {
  "landing  /[slug]": { manifest: ".next/server/app/(public)/[slug]/page_client-reference-manifest.js", max: 165 },
  "menu     /[slug]/menu": { manifest: ".next/server/app/(public)/[slug]/menu/page_client-reference-manifest.js", max: 152 },
  "menu     /menu": { manifest: ".next/server/app/(public)/menu/page_client-reference-manifest.js", max: 152 },
};

let failed = false;
for (const [name, { manifest, max }] of Object.entries(BUDGETS_KB)) {
  if (!fs.existsSync(manifest)) {
    console.error(`✗ ${name}: manifest not found (${manifest}). Run \`next build\` first.`);
    failed = true;
    continue;
  }
  const chunks = new Set(fs.readFileSync(manifest, "utf8").match(/static\/chunks\/[A-Za-z0-9_\-~.]+\.js/g) ?? []);
  let gz = 0;
  for (const chunk of chunks) {
    const file = `.next/${chunk}`;
    if (fs.existsSync(file)) gz += zlib.gzipSync(fs.readFileSync(file)).length;
  }
  const kb = gz / 1024;
  const ok = kb <= max;
  if (!ok) failed = true;
  console.log(`${ok ? "✓" : "✗"} ${name.padEnd(24)} ${kb.toFixed(1).padStart(6)} KB gzip (budget ${max} KB, ${chunks.size} chunks)`);
}
process.exit(failed ? 1 : 0);
