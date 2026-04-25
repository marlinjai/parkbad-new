interface CustomEventDoc {
  _type: 'customevent';
  eventTitle?: string;
  excerpt?: string;
  eventImage?: { asset?: { _ref?: string } };
  slug?: { current?: string } | string;
  eventDays?: Array<{ date?: string; startTime?: string; endTime?: string }>;
}

interface PostDoc {
  _type: 'post';
  title?: string;
  excerpt?: string;
  coverImage?: { asset?: { _ref?: string } };
  slug?: { current?: string } | string;
}

type SourceDoc = CustomEventDoc | PostDoc;

export interface HashableFields {
  type: 'customevent' | 'post';
  title?: string;
  excerpt?: string;
  imageRef?: string;
  slug?: string;
  eventDays?: Array<{ date?: string; startTime?: string; endTime?: string }>;
}

function getSlug(slug?: { current?: string } | string): string | undefined {
  if (!slug) return undefined;
  if (typeof slug === 'string') return slug;
  return slug.current;
}

export function extractHashableFields(doc: SourceDoc): HashableFields {
  if (doc._type === 'customevent') {
    return {
      type: 'customevent',
      title: doc.eventTitle,
      excerpt: doc.excerpt,
      imageRef: doc.eventImage?.asset?._ref,
      slug: getSlug(doc.slug),
      eventDays: doc.eventDays?.map(d => ({
        date: d.date,
        startTime: d.startTime,
        endTime: d.endTime,
      })),
    };
  }
  return {
    type: 'post',
    title: doc.title,
    excerpt: doc.excerpt,
    imageRef: doc.coverImage?.asset?._ref,
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
