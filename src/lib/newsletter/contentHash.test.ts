import { describe, it, expect } from 'vitest';
import { computeContentHash, extractHashableFields } from './contentHash';

describe('computeContentHash', () => {
  it('produces a stable hex hash for the same input', async () => {
    const input = { title: 'Hello', excerpt: 'World' };
    const a = await computeContentHash(input);
    const b = await computeContentHash(input);
    expect(a).toBe(b);
    expect(a).toMatch(/^[0-9a-f]{64}$/);
  });

  it('produces a different hash when content changes', async () => {
    const a = await computeContentHash({ title: 'Hello', excerpt: 'A' });
    const b = await computeContentHash({ title: 'Hello', excerpt: 'B' });
    expect(a).not.toBe(b);
  });

  it('is order-independent across object keys', async () => {
    const a = await computeContentHash({ title: 'X', excerpt: 'Y' });
    const b = await computeContentHash({ excerpt: 'Y', title: 'X' });
    expect(a).toBe(b);
  });
});

describe('extractHashableFields', () => {
  it('extracts customevent fields', () => {
    const doc = {
      _type: 'customevent' as const,
      eventTitle: 'Foo',
      excerpt: 'bar',
      eventImage: { asset: { _ref: 'image-abc' } },
      eventDays: [
        {
          date: '2026-05-01',
          slots: [
            { startTime: '15:00', endTime: '20:00', label: 'Hauptevent' },
          ],
        },
      ],
      slug: { current: 'foo' },
    };
    const out = extractHashableFields(doc);
    expect(out).toEqual({
      type: 'customevent',
      title: 'Foo',
      excerpt: 'bar',
      imageRef: 'image-abc',
      slug: 'foo',
      eventDays: [
        {
          date: '2026-05-01',
          slots: [{ startTime: '15:00', endTime: '20:00', label: 'Hauptevent' }],
        },
      ],
    });
  });

  it('extracts customevent fields with multi-slot day', () => {
    const doc = {
      _type: 'customevent' as const,
      eventTitle: 'Foo',
      slug: { current: 'foo' },
      eventDays: [
        {
          date: '2026-05-01',
          slots: [
            { startTime: '12:00', endTime: '22:00', label: 'A' },
            { startTime: '19:00', endTime: '22:00', label: 'B' },
          ],
        },
      ],
    };
    const out = extractHashableFields(doc);
    expect(out.eventDays).toEqual([
      {
        date: '2026-05-01',
        slots: [
          { startTime: '12:00', endTime: '22:00', label: 'A' },
          { startTime: '19:00', endTime: '22:00', label: 'B' },
        ],
      },
    ]);
  });

  it('extracts post fields', () => {
    const doc = {
      _type: 'post' as const,
      title: 'Foo',
      excerpt: 'bar',
      coverImage: { asset: { _ref: 'image-xyz' } },
      slug: { current: 'foo-post' },
    };
    const out = extractHashableFields(doc);
    expect(out).toEqual({
      type: 'post',
      title: 'Foo',
      excerpt: 'bar',
      imageRef: 'image-xyz',
      slug: 'foo-post',
    });
  });
});
