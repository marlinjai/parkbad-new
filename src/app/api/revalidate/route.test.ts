import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';
import { encodeSignatureHeader } from '@sanity/webhook';

// Proves the content webhook still revalidates the right cache tags after the
// Next.js 16 signature change to revalidateTag(tag, profile). The real
// next-sanity `parseBody` runs (real signature check); only next/cache is
// replaced by a spy. Nothing is published and no network call is made.

const revalidateTag = vi.fn();
vi.mock('next/cache', () => ({ revalidateTag: (...a: unknown[]) => revalidateTag(...a) }));

const SECRET = 'test-webhook-secret';

async function signedRequest(payload: unknown, secret = SECRET): Promise<NextRequest> {
  const raw = JSON.stringify(payload);
  const signature = await encodeSignatureHeader(raw, Date.now(), secret);
  return new NextRequest('http://localhost/api/revalidate', {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'sanity-webhook-signature': signature },
    body: raw,
  });
}

async function loadRoute() {
  vi.resetModules();
  vi.stubEnv('SANITY_REVALIDATE_SECRET', SECRET);
  return import('./route');
}

beforeEach(() => {
  revalidateTag.mockReset();
  vi.spyOn(console, 'log').mockImplementation(() => {});
  vi.spyOn(console, 'error').mockImplementation(() => {});
});
afterEach(() => {
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

describe('POST /api/revalidate', () => {
  it('expires the type tag, the type:slug tag and the general sanity tag immediately', async () => {
    const { POST } = await loadRoute();
    const res = await POST(await signedRequest({ _type: 'event', slug: 'summer-party' }));
    expect(res.status).toBe(200);
    expect(revalidateTag.mock.calls).toEqual([
      ['event', { expire: 0 }],
      ['event:summer-party', { expire: 0 }],
      ['sanity', { expire: 0 }],
    ]);
  });

  it('without a slug revalidates only the type tag and the general sanity tag', async () => {
    const { POST } = await loadRoute();
    const res = await POST(await signedRequest({ _type: 'openingHours' }));
    expect(res.status).toBe(200);
    expect(revalidateTag.mock.calls).toEqual([
      ['openingHours', { expire: 0 }],
      ['sanity', { expire: 0 }],
    ]);
  });

  it('refuses a payload signed with another secret and revalidates nothing', async () => {
    const { POST } = await loadRoute();
    const res = await POST(await signedRequest({ _type: 'event' }, 'someone-elses-secret'));
    expect(res.status).toBe(401);
    expect(revalidateTag).not.toHaveBeenCalled();
  });

  it('answers 400 for a signed payload without a type and revalidates nothing', async () => {
    const { POST } = await loadRoute();
    const res = await POST(await signedRequest({ slug: 'x' }));
    expect(res.status).toBe(400);
    expect(revalidateTag).not.toHaveBeenCalled();
  });
});
