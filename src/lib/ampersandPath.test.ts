import { describe, expect, it } from "vitest";
import { decodedAmpersandPath } from "./ampersandPath";

describe("decodedAmpersandPath", () => {
  it("maps the encoded sitemap form onto the route", () => {
    expect(decodedAmpersandPath("/Essen%26Trinken")).toBe("/Essen&Trinken");
  });

  it("accepts lower-case percent encoding", () => {
    expect(decodedAmpersandPath("/Feiern%26tagen")).toBe("/Feiern&tagen");
    expect(decodedAmpersandPath("/Feiern%26Tagen".toLowerCase())).toBe("/feiern&tagen");
  });

  it("keeps nested segments", () => {
    expect(decodedAmpersandPath("/Neuigkeiten%26Events/foo")).toBe("/Neuigkeiten&Events/foo");
  });

  it("leaves paths without an encoded ampersand alone", () => {
    expect(decodedAmpersandPath("/Essen&Trinken")).toBeNull();
    expect(decodedAmpersandPath("/Bildgalerie")).toBeNull();
    expect(decodedAmpersandPath("/")).toBeNull();
  });
});
