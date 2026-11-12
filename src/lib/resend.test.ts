import { afterEach, describe, expect, it, vi } from "vitest";

describe("getResend", () => {
  afterEach(() => vi.unstubAllEnvs());

  it("throws a clear error at call time when the key is missing", async () => {
    vi.resetModules();
    vi.stubEnv("RESEND_API_KEY", "");
    const { getResend } = await import("./resend");
    expect(() => getResend()).toThrow("RESEND_API_KEY is not set");
  });

  it("can be imported without a key, so a build without secrets succeeds", async () => {
    vi.resetModules();
    vi.stubEnv("RESEND_API_KEY", "");
    await expect(import("./resend")).resolves.toBeDefined();
  });

  it("returns one shared client once the key is set", async () => {
    vi.resetModules();
    vi.stubEnv("RESEND_API_KEY", "re_test_placeholder");
    const { getResend } = await import("./resend");
    expect(getResend()).toBe(getResend());
  });
});
