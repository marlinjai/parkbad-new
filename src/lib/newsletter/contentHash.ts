interface CustomEventDoc {
  _type: 'customevent';
  eventTitle?: string;
  excerpt?: string;
  eventContent?: unknown;
  eventImage?: { asset?: { _ref?: string; _id?: string } };
  slug?: { current?: string } | string;
  eventDays?: Array<{
    date?: string;
    slots?: Array<{ startTime?: string; endTime?: string; label?: string }>;
  }>;
}

interface PostDoc {
  _type: 'post';
  title?: string;
  excerpt?: string;
  coverImage?: { asset?: { _ref?: string; _id?: string } };
  slug?: { current?: string } | string;
}

type SourceDoc = CustomEventDoc | PostDoc;

export interface HashableFields {
  type: 'customevent' | 'post';
  title?: string;
  excerpt?: string;
  eventContent?: unknown;
  imageRef?: string;
  slug?: string;
  eventDays?: Array<{
    date?: string;
    slots?: Array<{ startTime?: string; endTime?: string; label?: string }>;
  }>;
}

function getSlug(slug?: { current?: string } | string): string | undefined {
  if (!slug) return undefined;
  if (typeof slug === 'string') return slug;
  return slug.current;
}

function getImageRef(asset?: { _ref?: string; _id?: string }): string | undefined {
  // Studio docs usually provide _ref, while fetched expanded assets provide _id.
  return asset?._ref ?? asset?._id;
}

export function extractHashableFields(doc: SourceDoc): HashableFields {
  if (doc._type === 'customevent') {
    return {
      type: 'customevent',
      title: doc.eventTitle,
      excerpt: doc.excerpt,
      imageRef: getImageRef(doc.eventImage?.asset),
      slug: getSlug(doc.slug),
      ...(doc.eventContent ? { eventContent: doc.eventContent } : {}),
      eventDays: doc.eventDays?.map(d => ({
        date: d.date,
        slots: d.slots?.map(s => ({
          startTime: s.startTime,
          endTime: s.endTime,
          label: s.label,
        })),
      })),
    };
  }
  return {
    type: 'post',
    title: doc.title,
    excerpt: doc.excerpt,
    imageRef: getImageRef(doc.coverImage?.asset),
    slug: getSlug(doc.slug),
  };
}

function stableStringify(value: unknown): string {
  if (value === null || typeof value !== 'object') return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(',')}]`;
  const keys = Object.keys(value as Record<string, unknown>).sort();
  const parts = keys.map(k => `${JSON.stringify(k)}:${stableStringify((value as Record<string, unknown>)[k])}`);
  return `{${parts.join(',')}}`;
}

export async function computeContentHash(input: object): Promise<string> {
  const stable = stableStringify(input);
  const data = new TextEncoder().encode(stable);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(digest))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}
