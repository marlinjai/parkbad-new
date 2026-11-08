// Admin endpoint to manually revalidate opening hours.
// Fails closed: without a configured REVALIDATION_TOKEN it answers 503 and
// revalidates nothing; with one, the request must carry `Authorization: Bearer
// <token>`, compared in constant time.
import { timingSafeEqual } from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';

function bearerMatches(header: string | null, token: string): boolean {
  const given = Buffer.from(header ?? '', 'utf8');
  const expected = Buffer.from(`Bearer ${token}`, 'utf8');
  // timingSafeEqual throws on different lengths; a length mismatch is a plain refusal.
  return given.length === expected.length && timingSafeEqual(given, expected);
}

export async function POST(request: NextRequest) {
  try {
    const expectedToken = process.env.REVALIDATION_TOKEN;

    if (!expectedToken || expectedToken.trim() === '') {
      console.error('REVALIDATION_TOKEN is not set: /api/revalidate-hours refuses every request until it is configured');
      return NextResponse.json({ error: 'Revalidation is not configured' }, { status: 503 });
    }

    if (!bearerMatches(request.headers.get('authorization'), expectedToken)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Revalidate the opening hours cache
    revalidateTag('opening-hours', { expire: 0 });

    console.log('Opening hours cache manually revalidated');

    return NextResponse.json({
      success: true,
      message: 'Opening hours cache revalidated',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error revalidating opening hours:', error);
    return NextResponse.json({ error: 'Failed to revalidate cache' }, { status: 500 });
  }
}
