import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';

/**
 * On-demand cache invalidation, called by the backend (see
 * services/revalidation.service.ts on the API) right after any admin
 * mutation that affects a tenant's public portal page. Lets the public site
 * fetch use a real ISR window (see PUBLIC_REVALIDATE_SECONDS in
 * public-site.service.ts) instead of `revalidate: 0`, while still reflecting
 * edits immediately rather than waiting out the window.
 */
import crypto from 'node:crypto';

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  const bearerSecret = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;
  // Header-only: a secret in the query string would end up in access logs and proxies.
  const secret = bearerSecret || req.headers.get('x-revalidate-secret');

  const expectedSecret = process.env.REVALIDATE_SECRET || '';
  if (!secret || !expectedSecret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const expectedBuf = Buffer.from(expectedSecret);
  const receivedBuf = Buffer.from(secret);
  if (expectedBuf.length !== receivedBuf.length || !crypto.timingSafeEqual(expectedBuf, receivedBuf)) {
    return NextResponse.json({ error: 'Invalid secret' }, { status: 401 });
  }

  const tags = req.nextUrl.searchParams.getAll('tag');
  if (tags.length === 0) {
    return NextResponse.json({ error: 'At least one tag query param is required' }, { status: 400 });
  }

  for (const tag of tags) {
    // Next 16: a 'max' profile only marks the tag stale (stale-while-revalidate),
    // so the first guest after an owner's save still got the old page. `expire: 0`
    // expires it immediately — the next request renders the new content.
    revalidateTag(tag, { expire: 0 });
  }

  return NextResponse.json({ revalidated: true, tags });
}
