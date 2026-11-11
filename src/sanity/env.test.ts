import { afterEach, describe, expect, it, vi } from "vitest";

// useCdn is computed when the module loads, so each case loads a fresh copy
// under its own environment.
async function loadUseCdn(env: Record<string, string | undefined>) {
  vi.resetModules();
  vi.unstubAllEnvs();
  vi.stubEnv("NEXT_PUBLIC_SANITY_DATASET", "production");
  vi.stubEnv("NEXT_PUBLIC_SANITY_PROJECT_ID", "test");
  for (const [key, value] of Object.entries(env)) vi.stubEnv(key, value);
  return (await import("./env")).useCdn;
}

describe("useCdn", () => {
  afterEach(() => vi.unstubAllEnvs());

  it("is on in production on Vercel", async () => {
    expect(await loadUseCdn({ NODE_ENV: "production", VERCEL_ENV: "production", APP_ENV: undefined })).toBe(true);
  });

  it("is on in production on the Coolify server", async () => {
    expect(await loadUseCdn({ NODE_ENV: "production", VERCEL_ENV: undefined, APP_ENV: "production" })).toBe(true);
  });

  it("is off on a Vercel preview", async () => {
    expect(await loadUseCdn({ NODE_ENV: "production", VERCEL_ENV: "preview", APP_ENV: undefined })).toBe(false);
  });

  it("is off on a staging container", async () => {
    expect(await loadUseCdn({ NODE_ENV: "production", VERCEL_ENV: undefined, APP_ENV: "staging" })).toBe(false);
  });

  it("is off in development even when APP_ENV says production", async () => {
    expect(await loadUseCdn({ NODE_ENV: "development", VERCEL_ENV: undefined, APP_ENV: "production" })).toBe(false);
  });
});
