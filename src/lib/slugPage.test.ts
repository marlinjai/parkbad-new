import { describe, expect, it } from "vitest";
import { isUnknownSlug, slugParams } from "./slugPage";

describe("slugParams", () => {
  it("includes posts and events, not only the events", () => {
    expect(slugParams([{ slug: "a-post" }], [{ slug: "an-event" }])).toEqual([
      { slug: "a-post" },
      { slug: "an-event" },
    ]);
  });

  it("skips documents without a slug and drops duplicates", () => {
    expect(slugParams([{ slug: "x" }, { slug: null }, {}, null], [{ slug: "x" }, { slug: "" }, { slug: "y" }])).toEqual([
      { slug: "x" },
      { slug: "y" },
    ]);
  });

  it("copes with a missing result set", () => {
    expect(slugParams(null, undefined)).toEqual([]);
    expect(slugParams(undefined, [{ slug: "e" }])).toEqual([{ slug: "e" }]);
  });
});

describe("isUnknownSlug", () => {
  it("is a 404 when neither a post nor an event matches", () => {
    expect(isUnknownSlug({ post: null, event: null, isDraftMode: false })).toBe(true);
  });

  it("serves a matching post or event", () => {
    expect(isUnknownSlug({ post: { _id: "p" }, event: null, isDraftMode: false })).toBe(false);
    expect(isUnknownSlug({ post: null, event: { _id: "e" }, isDraftMode: false })).toBe(false);
  });

  it("keeps rendering in draft mode, where unpublished drafts load in the browser", () => {
    expect(isUnknownSlug({ post: null, event: null, isDraftMode: true })).toBe(false);
  });
});
