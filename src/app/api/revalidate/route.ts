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
export async function POST(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get('secret');
  if (!secret || !process.env.REVALIDATE_SECRET || secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ error: 'Invalid secret' }, { status: 401 });
  }

  const tags = req.nextUrl.searchParams.getAll('tag');
  if (tags.length === 0) {
    return NextResponse.json({ error: 'At least one tag query param is required' }, { status: 400 });
  }

  for (const tag of tags) {
    // Next 16's revalidateTag requires a cache-life profile — 'max' purges
    // the tag regardless of the fetch's own configured revalidate window,
    // matching the "invalidate right now" intent of this endpoint.
    revalidateTag(tag, 'max');
  }

  return NextResponse.json({ revalidated: true, tags });
}
