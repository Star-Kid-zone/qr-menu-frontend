import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import crypto from 'node:crypto';
import { HTTP_STATUS } from '@/constants';

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  const bearerSecret = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;
  // Header-only: a secret in the query string would end up in access logs and proxies.
  const secret = bearerSecret || req.headers.get('x-revalidate-secret');

  const expectedSecret = process.env.REVALIDATE_SECRET || '';
  if (!secret || !expectedSecret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: HTTP_STATUS.UNAUTHORIZED });
  }

  const expectedBuf = Buffer.from(expectedSecret);
  const receivedBuf = Buffer.from(secret);
  if (expectedBuf.length !== receivedBuf.length || !crypto.timingSafeEqual(expectedBuf, receivedBuf)) {
    return NextResponse.json({ error: 'Invalid secret' }, { status: HTTP_STATUS.UNAUTHORIZED });
  }

  const tags = req.nextUrl.searchParams.getAll('tag');
  if (tags.length === 0) {
    return NextResponse.json({ error: 'At least one tag query param is required' }, { status: HTTP_STATUS.BAD_REQUEST });
  }

  for (const tag of tags) {
    // Next 16: a 'max' profile only marks the tag stale (stale-while-revalidate),
    // so the first guest after an owner's save still got the old page. `expire: 0`
    // expires it immediately — the next request renders the new content.
    revalidateTag(tag, { expire: 0 });
  }

  return NextResponse.json({ revalidated: true, tags });
}
