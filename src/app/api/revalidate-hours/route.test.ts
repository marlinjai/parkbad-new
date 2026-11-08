import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';

// The manual opening-hours revalidation endpoint expires its tag immediately and
// honours its token. next/cache is a spy; nothing real is revalidated.

const revalidateTag = vi.fn();
vi.mock('next/cache', () => ({ revalidateTag: (...a: unknown[]) => revalidateTag(...a) }));

const req = (headers: Record<string, string> = {}) =>
  new NextRequest('http://localhost/api/revalidate-hours', { method: 'POST', headers });

beforeEach(() => {
  revalidateTag.mockReset();
  vi.spyOn(console, 'log').mockImplementation(() => {});
});
afterEach(() => {
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

describe('POST /api/revalidate-hours', () => {
  it('expires the opening-hours tag immediately', async () => {
    vi.stubEnv('REVALIDATION_TOKEN', 'tok');
    const { POST } = await import('./route');
    const res = await POST(req({ authorization: 'Bearer tok' }));
    expect(res.status).toBe(200);
    expect(revalidateTag).toHaveBeenCalledExactlyOnceWith('opening-hours', { expire: 0 });
  });

  it('refuses a wrong token and revalidates nothing', async () => {
    vi.stubEnv('REVALIDATION_TOKEN', 'tok');
    const { POST } = await import('./route');
    const res = await POST(req({ authorization: 'Bearer nope' }));
    expect(res.status).toBe(401);
    expect(revalidateTag).not.toHaveBeenCalled();
  });
});
