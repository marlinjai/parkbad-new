import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';

// The manual opening-hours revalidation endpoint fails closed and expires its tag
// immediately for the right token. next/cache is a spy; nothing real is
// revalidated and no network call is made.

const revalidateTag = vi.fn();
vi.mock('next/cache', () => ({ revalidateTag: (...a: unknown[]) => revalidateTag(...a) }));

const req = (headers: Record<string, string> = {}) =>
  new NextRequest('http://localhost/api/revalidate-hours', { method: 'POST', headers });

let errorSpy: ReturnType<typeof vi.spyOn>;

beforeEach(() => {
  revalidateTag.mockReset();
  vi.spyOn(console, 'log').mockImplementation(() => {});
  errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
});
afterEach(() => {
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

describe('POST /api/revalidate-hours', () => {
  it('right token: 200 and the opening-hours tag is expired immediately', async () => {
    vi.stubEnv('REVALIDATION_TOKEN', 'tok');
    const { POST } = await import('./route');
    const res = await POST(req({ authorization: 'Bearer tok' }));
    expect(res.status).toBe(200);
    expect(revalidateTag).toHaveBeenCalledExactlyOnceWith('opening-hours', { expire: 0 });
  });

  it('wrong token: 401 and nothing is revalidated', async () => {
    vi.stubEnv('REVALIDATION_TOKEN', 'tok');
    const { POST } = await import('./route');
    const res = await POST(req({ authorization: 'Bearer nope' }));
    expect(res.status).toBe(401);
    expect(revalidateTag).not.toHaveBeenCalled();
  });

  it('a token of another length and a prefix of the right one are plain 401s, never an exception', async () => {
    vi.stubEnv('REVALIDATION_TOKEN', 'a-longer-token-value');
    const { POST } = await import('./route');
    for (const header of ['Bearer a', 'Bearer a-longer-token-valu', 'Bearer a-longer-token-value-and-more', 'a-longer-token-value', 'Bearer']) {
      const res = await POST(req({ authorization: header }));
      expect(res.status).toBe(401);
    }
    expect(revalidateTag).not.toHaveBeenCalled();
  });

  it('a wrong token of exactly the right byte length is refused by the constant-time comparison itself', async () => {
    vi.stubEnv('REVALIDATION_TOKEN', 'tok');
    const { POST } = await import('./route');
    // 'tox' and 'toK' have the length of 'tok'; 'é' (2 bytes) vs 'ab' (2 bytes) covers a multi-byte mismatch.
    for (const header of ['Bearer tox', 'Bearer toK', 'Bearer TOK']) {
      expect((await POST(req({ authorization: header }))).status).toBe(401);
    }
    vi.stubEnv('REVALIDATION_TOKEN', 'ab');
    expect((await POST(req({ authorization: 'Bearer \u00e9' }))).status).toBe(401);
    expect(revalidateTag).not.toHaveBeenCalled();
  });

  it('missing header: 401 and nothing is revalidated', async () => {
    vi.stubEnv('REVALIDATION_TOKEN', 'tok');
    const { POST } = await import('./route');
    const res = await POST(req());
    expect(res.status).toBe(401);
    expect(revalidateTag).not.toHaveBeenCalled();
  });

  it('token unset: 503, nothing is revalidated, the log names the variable but no value', async () => {
    vi.stubEnv('REVALIDATION_TOKEN', undefined as unknown as string);
    delete process.env.REVALIDATION_TOKEN;
    const { POST } = await import('./route');
    // Even a request that would have matched the old "no auth when unset" path.
    const res = await POST(req({ authorization: 'Bearer anything' }));
    expect(res.status).toBe(503);
    expect(revalidateTag).not.toHaveBeenCalled();
    expect(errorSpy).toHaveBeenCalledWith(expect.stringContaining('REVALIDATION_TOKEN'));
    expect(JSON.stringify(errorSpy.mock.calls)).not.toContain('anything');
  });

  it('token empty or only spaces counts as unset: 503 and nothing is revalidated', async () => {
    const { POST } = await import('./route');
    for (const value of ['', '   ']) {
      vi.stubEnv('REVALIDATION_TOKEN', value);
      const res = await POST(req({ authorization: `Bearer ${value}` }));
      expect(res.status).toBe(503);
    }
    expect(revalidateTag).not.toHaveBeenCalled();
  });
});
