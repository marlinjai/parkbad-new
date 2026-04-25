# Newsletter & Contact Admin Improvements Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Decouple newsletter sending from publish, expose visible send-status, gate manual sending behind a content-hashed test, and persist contact form submissions as a Sanity inbox with reply-from-Studio.

**Architecture:** Three independent workstreams. (A) Schema + Studio panel that surfaces `newsletterStatus`. (B) Manual send button with content-hash gate, reusing extracted broadcast helper, plus authenticated API route. (C) `contactSubmission` schema + capture in existing contact form route + Studio inbox structure node + reply-via-Resend route with threading headers. Auth for new write routes uses Sanity user token validated server-side.

**Tech Stack:** Next.js 15 App Router, React 19, Sanity 4 Studio (mounted at `/admin`), Resend SDK 6, vitest 1 (added in this plan for pure-logic tests).

**Spec:** `docs/superpowers/specs/2026-04-25-newsletter-admin-improvements-design.md`

**Testing approach:** This codebase has no existing test runner. Vitest is added in Task 0.1 for the two pure-logic files (`contentHash.ts`, `sendBroadcast.ts`). Everything else uses explicit manual verification steps against a local dev server (`pnpm dev` or `npm run dev:local` to skip Infisical wrapping).

**Parallelization:** Tasks 0.x are foundation. After foundation, Workstream A, B, C can be picked up by separate agents. Workstream B depends on `lib/newsletter/sendBroadcast.ts` and the `newsletterStatus` schema field from A, so B should start AFTER tasks A.1 and B.1 are merged. Workstream C is fully independent.

---

## Workstream 0: Foundation

### Task 0.1: Add vitest

**Files:**
- Modify: `package.json`
- Create: `vitest.config.ts`

- [ ] **Step 1: Install vitest as dev dependency**

```bash
cd /Users/marlinjai/software-dev/parkbad-new
npm install --save-dev vitest@^1.6.0
```

- [ ] **Step 2: Create vitest config**

Write `vitest.config.ts`:

```ts
import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    globals: false,
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

- [ ] **Step 3: Add npm script**

Modify `package.json` `scripts` block. Add line `"test": "vitest run"` after the existing `lint` line.

- [ ] **Step 4: Verify it runs**

Run: `npm run test`
Expected: `No test files found, exiting with code 1` (acceptable: confirms vitest is wired up).

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json vitest.config.ts
git commit -m "test: add vitest for pure-logic unit tests"
```

### Task 0.2: Sanity write client

**Files:**
- Create: `src/sanity/lib/sanity.write.ts`

- [ ] **Step 1: Create the write client**

Write `src/sanity/lib/sanity.write.ts`:

```ts
import { createClient } from 'next-sanity';
import { apiVersion, dataset, projectId } from '../env';

if (!process.env.SANITY_API_WRITE_TOKEN) {
  console.warn('SANITY_API_WRITE_TOKEN is not set; write operations will fail.');
}

export const writeClient = createClient({
  apiVersion,
  dataset,
  projectId,
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
  perspective: 'raw',
});
```

- [ ] **Step 2: Add SANITY_API_WRITE_TOKEN to .env.example**

Read `.env.example`. Append line: `SANITY_API_WRITE_TOKEN="sk..."` if not already present.

- [ ] **Step 3: Provision token in Infisical**

Manual step. Tell the user:

> Create a Sanity write token at `https://www.sanity.io/manage` → project → API → Tokens → Add API token → name `parkbad-write`, permissions `Editor`. Then store it in Infisical as `SANITY_API_WRITE_TOKEN` for both `dev` and `prod` environments via `infisical secrets set SANITY_API_WRITE_TOKEN="<value>" --env=dev` and `--env=prod`.

This is a blocking prerequisite for any write-back step (B.5, C.2, C.5). Other tasks can proceed without it.

- [ ] **Step 4: Commit**

```bash
git add src/sanity/lib/sanity.write.ts .env.example
git commit -m "feat(sanity): add server-side write client"
```

---

## Workstream A: Newsletter status & decoupled sending

### Task A.1: Add newsletterStatus schema field

**Files:**
- Modify: `src/sanity/schemas/customevent.ts`
- Modify: `src/sanity/schemas/post.ts`

- [ ] **Step 1: Replace sendNewsletter field on customevent**

In `src/sanity/schemas/customevent.ts`, locate the `sendNewsletter` defineField (around line 290). Replace it with:

```ts
defineField({
  name: "newsletterStatus",
  title: "Newsletter Status",
  type: "object",
  readOnly: true,
  fields: [
    defineField({ name: "lastSentAt", title: "Zuletzt versendet", type: "datetime" }),
    defineField({
      name: "lastSentTrigger",
      title: "Auslöser",
      type: "string",
      options: { list: [{ title: "Manuell", value: "manual" }] },
    }),
    defineField({ name: "lastSentBroadcastId", title: "Broadcast-ID", type: "string" }),
    defineField({ name: "lastSentRecipientCount", title: "Empfänger", type: "number" }),
    defineField({ name: "lastSentContentHash", title: "Inhalts-Hash beim Senden", type: "string" }),
    defineField({ name: "lastTestSentAt", title: "Letzter Test", type: "datetime" }),
    defineField({ name: "lastTestContentHash", title: "Inhalts-Hash beim Test", type: "string" }),
    defineField({
      name: "sendHistory",
      title: "Verlauf",
      type: "array",
      of: [{
        type: "object",
        fields: [
          defineField({ name: "sentAt", type: "datetime" }),
          defineField({ name: "trigger", type: "string" }),
          defineField({ name: "broadcastId", type: "string" }),
          defineField({ name: "recipientCount", type: "number" }),
        ],
      }],
    }),
  ],
}),
```

- [ ] **Step 2: Replace sendNewsletter field on post**

In `src/sanity/schemas/post.ts`, locate the `sendNewsletter` defineField (around line 190). Replace it with the exact same `newsletterStatus` defineField block from Step 1.

- [ ] **Step 3: Verify Studio loads**

Run: `npm run dev:local` (skip Infisical for quick verification)
Open `http://localhost:3000/admin`, open any event document.
Expected: Form loads without console errors. The "Newsletter senden" toggle is gone. A new "Newsletter Status" section appears (will be empty for now). The existing "Newsletter Test" section still shows the test button.

- [ ] **Step 4: Commit**

```bash
git add src/sanity/schemas/customevent.ts src/sanity/schemas/post.ts
git commit -m "feat(schema): replace sendNewsletter toggle with newsletterStatus tracking"
```

### Task A.2: Strip auto-send from webhook

**Files:**
- Modify: `src/app/api/newsletter/webhook/route.ts`

- [ ] **Step 1: Read the file end-to-end**

Read `src/app/api/newsletter/webhook/route.ts` fully. Confirm whether it does anything other than calling `/api/newsletter/send` (e.g., revalidation). Based on the current spec analysis, it does NOT. Its sole purpose is auto-send.

- [ ] **Step 2: Delete the route file**

```bash
rm src/app/api/newsletter/webhook/route.ts
```

- [ ] **Step 3: Tell the user to remove webhook in Sanity manage**

Output to user:

> The `/api/newsletter/webhook` route is deleted. You must also remove (or disable) the corresponding webhook in `https://www.sanity.io/manage/personal/project/<projectId>/api/webhooks`. Look for a webhook pointing at `https://parkbad-gt.de/api/newsletter/webhook` or similar. Without this, Sanity will keep posting to a 404, which is harmless but noisy.

- [ ] **Step 4: Commit**

```bash
git add -A src/app/api/newsletter/webhook/
git commit -m "feat(newsletter): remove auto-send-on-publish webhook"
```

### Task A.3: NewsletterStatusPanel component

**Files:**
- Create: `src/app/_components/Sanity_Components/NewsletterStatusPanel.tsx`
- Modify: `src/sanity/schemas/customevent.ts`
- Modify: `src/sanity/schemas/post.ts`

- [ ] **Step 1: Create the component**

Write `src/app/_components/Sanity_Components/NewsletterStatusPanel.tsx`:

```tsx
'use client';

import React from 'react';
import { Card, Stack, Text, Badge, Box } from '@sanity/ui';
import type { ObjectInputProps } from 'sanity';

interface SendHistoryEntry {
  sentAt?: string;
  trigger?: string;
  broadcastId?: string;
  recipientCount?: number;
}

interface NewsletterStatusValue {
  lastSentAt?: string;
  lastSentTrigger?: string;
  lastSentBroadcastId?: string;
  lastSentRecipientCount?: number;
  lastTestSentAt?: string;
  lastTestContentHash?: string;
  lastSentContentHash?: string;
  sendHistory?: SendHistoryEntry[];
}

function formatDateTime(iso?: string): string {
  if (!iso) return '';
  const d = new Date(iso);
  return d.toLocaleString('de-DE', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

export default function NewsletterStatusPanel(props: ObjectInputProps<NewsletterStatusValue>) {
  const value = props.value ?? {};
  const hasBeenSent = Boolean(value.lastSentAt);

  return (
    <Card padding={4} radius={2} shadow={1} tone={hasBeenSent ? 'positive' : 'transparent'}>
      <Stack space={3}>
        <Text size={1} weight="bold">Newsletter Status</Text>

        {hasBeenSent ? (
          <Stack space={2}>
            <Text size={2}>
              Versendet am <strong>{formatDateTime(value.lastSentAt)}</strong> an{' '}
              <strong>{value.lastSentRecipientCount ?? '?'}</strong> Abonnenten
            </Text>
            <Box>
              <Badge tone="primary">{value.lastSentTrigger === 'manual' ? 'manuell' : (value.lastSentTrigger ?? 'unbekannt')}</Badge>
              {value.lastSentBroadcastId && (
                <Text size={0} muted style={{ marginLeft: 8 }}>
                  Broadcast: {value.lastSentBroadcastId}
                </Text>
              )}
            </Box>
          </Stack>
        ) : (
          <Text size={2} muted>Newsletter noch nicht versendet</Text>
        )}

        {value.lastTestSentAt && (
          <Text size={1} muted>
            Letzter Test: {formatDateTime(value.lastTestSentAt)}
          </Text>
        )}

        {value.sendHistory && value.sendHistory.length > 1 && (
          <details>
            <summary style={{ cursor: 'pointer', fontSize: 12, color: '#666' }}>
              Verlauf anzeigen ({value.sendHistory.length} Einträge)
            </summary>
            <Stack space={2} marginTop={2}>
              {value.sendHistory.map((entry, i) => (
                <Card key={i} padding={2} radius={1} tone="transparent" border>
                  <Text size={1}>
                    {formatDateTime(entry.sentAt)}, {entry.recipientCount ?? '?'} Empfänger ({entry.trigger ?? 'unbekannt'})
                  </Text>
                </Card>
              ))}
            </Stack>
          </details>
        )}
      </Stack>
    </Card>
  );
}
```

- [ ] **Step 2: Wire component into customevent schema**

In `src/sanity/schemas/customevent.ts`, add to the import block at top:

```ts
import NewsletterStatusPanel from "@/app/_components/Sanity_Components/NewsletterStatusPanel";
```

Modify the `newsletterStatus` defineField from Task A.1 to add a `components` block at the top level of the field:

```ts
defineField({
  name: "newsletterStatus",
  title: "Newsletter Status",
  type: "object",
  readOnly: true,
  components: { input: NewsletterStatusPanel },
  fields: [ /* same as A.1 */ ],
}),
```

- [ ] **Step 3: Wire component into post schema**

Same change in `src/sanity/schemas/post.ts`. Import `NewsletterStatusPanel`, add `components: { input: NewsletterStatusPanel }` to the `newsletterStatus` field.

- [ ] **Step 4: Verify**

Run: `npm run dev:local`
Open `http://localhost:3000/admin`, open any event.
Expected: The Newsletter Status section now renders the custom panel with "Newsletter noch nicht versendet" text.

- [ ] **Step 5: Commit**

```bash
git add src/app/_components/Sanity_Components/NewsletterStatusPanel.tsx src/sanity/schemas/customevent.ts src/sanity/schemas/post.ts
git commit -m "feat(studio): add NewsletterStatusPanel for newsletter send-state visibility"
```

---

## Workstream B: Manual send-now button

### Task B.1: contentHash utility

**Files:**
- Create: `src/lib/newsletter/contentHash.ts`
- Create: `src/lib/newsletter/contentHash.test.ts`

- [ ] **Step 1: Write the failing test**

Write `src/lib/newsletter/contentHash.test.ts`:

```ts
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
      _type: 'customevent',
      eventTitle: 'Foo',
      excerpt: 'bar',
      eventImage: { asset: { _ref: 'image-abc' } },
      eventDays: [
        { date: '2026-05-01', startTime: '15:00', endTime: '20:00', description: 'ignored' },
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
      eventDays: [{ date: '2026-05-01', startTime: '15:00', endTime: '20:00' }],
    });
  });

  it('extracts post fields', () => {
    const doc = {
      _type: 'post',
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- contentHash`
Expected: FAIL, `Cannot find module './contentHash'`.

- [ ] **Step 3: Implement contentHash**

Write `src/lib/newsletter/contentHash.ts`:

```ts
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
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- contentHash`
Expected: All 5 tests pass.

- [ ] **Step 5: Commit**

```bash
git add src/lib/newsletter/contentHash.ts src/lib/newsletter/contentHash.test.ts
git commit -m "feat(newsletter): contentHash utility for test/send gating"
```

### Task B.2: sendBroadcast helper

**Files:**
- Create: `src/lib/newsletter/sendBroadcast.ts`
- Create: `src/lib/newsletter/sendBroadcast.test.ts`

- [ ] **Step 1: Write the failing test**

Write `src/lib/newsletter/sendBroadcast.test.ts`:

```ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { buildBroadcastPayload } from './sendBroadcast';

describe('buildBroadcastPayload', () => {
  beforeEach(() => {
    vi.stubEnv('NEXT_PUBLIC_BASE_URL', 'https://parkbad-gt.de');
  });

  it('builds a post broadcast payload', () => {
    const payload = buildBroadcastPayload({
      type: 'post',
      title: 'Hello',
      excerpt: 'world',
      slug: 'hello-world',
      audienceId: 'aud_123',
      htmlBody: '<p>hi</p>',
    });
    expect(payload.subject).toBe('Parkbad Gütersloh: Hello');
    expect(payload.audienceId).toBe('aud_123');
    expect(payload.from).toBe('Parkbad Gütersloh <newsletter@parkbad-gt.de>');
    expect(payload.text).toContain('Hello');
    expect(payload.text).toContain('https://parkbad-gt.de/hello-world');
  });

  it('builds an event broadcast payload with event days', () => {
    const payload = buildBroadcastPayload({
      type: 'event',
      title: 'Saisonöffnung',
      slug: 'saisonoeffnung',
      audienceId: 'aud_123',
      htmlBody: '<p>hi</p>',
      eventDays: [
        { date: '2026-05-01', startTime: '15:00', endTime: '20:00' },
      ],
    });
    expect(payload.subject).toBe('Neue Veranstaltung im Parkbad Gütersloh: Saisonöffnung');
    expect(payload.text).toMatch(/01\.05\.2026/);
    expect(payload.text).toMatch(/15:00 - 20:00/);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- sendBroadcast`
Expected: FAIL, module not found.

- [ ] **Step 3: Implement sendBroadcast**

Write `src/lib/newsletter/sendBroadcast.ts`:

```ts
import 'server-only';
import { Resend } from 'resend';

export interface BroadcastInput {
  type: 'post' | 'event';
  title: string;
  excerpt?: string;
  slug: string;
  imageUrl?: string;
  eventDays?: Array<{ date?: string; startTime?: string; endTime?: string }>;
  audienceId: string;
  htmlBody: string;
}

export interface BroadcastPayload {
  from: string;
  audienceId: string;
  subject: string;
  replyTo: string;
  html: string;
  text: string;
}

export function buildBroadcastPayload(input: BroadcastInput): BroadcastPayload {
  const subject = input.type === 'post'
    ? `Parkbad Gütersloh: ${input.title}`
    : `Neue Veranstaltung im Parkbad Gütersloh: ${input.title}`;

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://parkbad-gt.de';

  const eventLines = input.type === 'event' && input.eventDays
    ? input.eventDays
        .map(d => {
          if (!d.date) return '';
          const date = new Date(d.date).toLocaleDateString('de-DE');
          return `${date}, ${d.startTime ?? ''} - ${d.endTime ?? ''}`;
        })
        .filter(Boolean)
        .join('\n')
    : '';

  const text = [
    input.type === 'post' ? `Neue Neuigkeit: ${input.title}` : `Neue Veranstaltung: ${input.title}`,
    input.excerpt ?? '',
    eventLines,
    `Mehr erfahren: ${baseUrl}/${input.slug}`,
    '--',
    'Parkbad Gütersloh Newsletter',
  ].filter(Boolean).join('\n\n');

  return {
    from: 'Parkbad Gütersloh <newsletter@parkbad-gt.de>',
    audienceId: input.audienceId,
    subject,
    replyTo: 'verwaltung@parkbad-gt.de',
    html: input.htmlBody,
    text,
  };
}

export interface SendBroadcastResult {
  broadcastId: string;
  recipientCount: number;
}

export async function sendBroadcast(input: BroadcastInput): Promise<SendBroadcastResult> {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const payload = buildBroadcastPayload(input);

  const create = await resend.broadcasts.create(payload);
  if (create.error || !create.data?.id) {
    throw new Error(`Broadcast create failed: ${JSON.stringify(create.error)}`);
  }
  const broadcastId = create.data.id;

  const send = await resend.broadcasts.send(broadcastId);
  if (send.error) {
    throw new Error(`Broadcast send failed: ${JSON.stringify(send.error)}`);
  }

  let recipientCount = 0;
  try {
    const contacts = await resend.contacts.list({ audienceId: input.audienceId });
    // @ts-ignore - Resend SDK types are loose here
    const list = contacts.data?.data ?? [];
    recipientCount = list.filter((c: { unsubscribed?: boolean }) => !c.unsubscribed).length;
  } catch (err) {
    console.warn('Failed to fetch recipient count:', err);
  }

  return { broadcastId, recipientCount };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- sendBroadcast`
Expected: 2 tests pass.

- [ ] **Step 5: Commit**

```bash
git add src/lib/newsletter/sendBroadcast.ts src/lib/newsletter/sendBroadcast.test.ts
git commit -m "feat(newsletter): extract sendBroadcast helper for reuse"
```

### Task B.3: Refactor /api/newsletter/test to use shared helper and write back status

**Files:**
- Modify: `src/app/api/newsletter/test/route.ts`

- [ ] **Step 1: Update test route**

Open `src/app/api/newsletter/test/route.ts`. Replace the entire file with:

```ts
// src/app/api/newsletter/test/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { NewsletterTemplate } from '../../../_components/email_templates/newsletter-template';
import { render } from '@react-email/render';
import React from 'react';
import { sanityFetch } from '../../../../sanity/lib/sanity.fetch';
import { writeClient } from '../../../../sanity/lib/sanity.write';
import { urlForImage } from '../../../../sanity/lib/sanity.image';
import { computeContentHash, extractHashableFields } from '@/lib/newsletter/contentHash';

const resend = new Resend(process.env.RESEND_API_KEY);

interface TestNewsletterRequest {
  documentId: string;
  documentType: 'post' | 'customevent';
  testEmail: string;
}

const DOC_QUERY = `*[_id == $id][0]{
  _type, _id, "slug": slug.current, title, excerpt, date,
  coverImage{ asset->{_id, url}, crop, hotspot, alt },
  eventTitle,
  eventDays[]{ date, startTime, endTime, description },
  eventImage{ asset->{_id, url}, crop, hotspot, alt }
}`;

export async function POST(request: NextRequest) {
  try {
    const { documentId, documentType, testEmail } = await request.json() as TestNewsletterRequest;

    if (!documentId || !documentType || !testEmail || !testEmail.includes('@')) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }
    if (documentType !== 'post' && documentType !== 'customevent') {
      return NextResponse.json({ error: 'Invalid document type' }, { status: 400 });
    }

    const document = await sanityFetch<any>({ query: DOC_QUERY, params: { id: documentId } });
    if (!document?.slug) {
      return NextResponse.json({ error: 'Document not found or missing slug' }, { status: 404 });
    }

    const newsletterType = document._type === 'post' ? 'post' : 'event';
    const title = document.title ?? document.eventTitle ?? 'Test Newsletter';
    const slug = typeof document.slug === 'string' ? document.slug : document.slug?.current;
    const imageUrl = document.coverImage
      ? urlForImage(document.coverImage).url()
      : (document.eventImage ? urlForImage(document.eventImage).url() : undefined);

    const html = await render(React.createElement(NewsletterTemplate, {
      type: newsletterType,
      title, excerpt: document.excerpt, imageUrl, slug,
      eventDays: document.eventDays,
    }));

    const subject = newsletterType === 'post'
      ? `[TEST] Parkbad Gütersloh: ${title}`
      : `[TEST] Neue Veranstaltung im Parkbad Gütersloh: ${title}`;

    const { data, error } = await resend.emails.send({
      from: 'Parkbad Gütersloh <newsletter@parkbad-gt.de>',
      to: [testEmail],
      subject,
      replyTo: 'verwaltung@parkbad-gt.de',
      html,
      text: `[TEST] ${title}\n\n${document.excerpt ?? ''}\n\nMehr: ${process.env.NEXT_PUBLIC_BASE_URL}/${slug}`,
    });

    if (error) {
      return NextResponse.json({ error: 'Failed to send test email', details: error }, { status: 500 });
    }

    // Write back status: lastTestSentAt + lastTestContentHash
    try {
      const hashable = extractHashableFields({ ...document, _type: documentType });
      const contentHash = await computeContentHash(hashable);
      await writeClient.patch(documentId).setIfMissing({ newsletterStatus: {} }).set({
        'newsletterStatus.lastTestSentAt': new Date().toISOString(),
        'newsletterStatus.lastTestContentHash': contentHash,
      }).commit();
    } catch (patchErr) {
      console.error('Failed to write test status back:', patchErr);
    }

    return NextResponse.json({ success: true, emailId: data?.id });
  } catch (error) {
    console.error('Test newsletter error:', error);
    return NextResponse.json({
      error: 'Failed to send test newsletter',
      details: error instanceof Error ? error.message : String(error),
    }, { status: 500 });
  }
}
```

- [ ] **Step 2: Verify test send still works and writes status**

Manual: Run `npm run dev` (Infisical wrap, needed for RESEND_API_KEY and SANITY_API_WRITE_TOKEN). Open Studio, open an event. Use the existing test button to send a test email to your address.

Expected:
- Test email arrives.
- After page refresh, the NewsletterStatusPanel shows a "Letzter Test: …" line with the current timestamp.

- [ ] **Step 3: Commit**

```bash
git add src/app/api/newsletter/test/route.ts
git commit -m "feat(newsletter): test endpoint writes lastTestSentAt + contentHash"
```

### Task B.4: recipient-count route

**Files:**
- Create: `src/app/api/newsletter/recipient-count/route.ts`

- [ ] **Step 1: Create the route**

Write `src/app/api/newsletter/recipient-count/route.ts`:

```ts
import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function GET() {
  const audienceId = process.env.RESEND_AUDIENCE_ID;
  if (!audienceId) {
    return NextResponse.json({ error: 'Audience not configured' }, { status: 500 });
  }
  try {
    const contacts = await resend.contacts.list({ audienceId });
    // @ts-ignore - Resend SDK types are loose
    const list = contacts.data?.data ?? [];
    const count = list.filter((c: { unsubscribed?: boolean }) => !c.unsubscribed).length;
    return NextResponse.json({ count });
  } catch (err) {
    console.error('recipient-count error:', err);
    return NextResponse.json({ count: 0, error: 'Failed to fetch' }, { status: 500 });
  }
}
```

- [ ] **Step 2: Verify**

Run `npm run dev`. In another terminal:

```bash
curl http://localhost:3000/api/newsletter/recipient-count
```

Expected: `{"count":<n>}` where n matches the active subscriber count in your Resend audience.

- [ ] **Step 3: Commit**

```bash
git add src/app/api/newsletter/recipient-count/route.ts
git commit -m "feat(newsletter): add recipient-count endpoint for Studio UI"
```

### Task B.5: send-now route

**Files:**
- Create: `src/app/api/newsletter/send-now/route.ts`

- [ ] **Step 1: Create the route**

Write `src/app/api/newsletter/send-now/route.ts`:

```ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from 'next-sanity';
import { render } from '@react-email/render';
import React from 'react';
import { NewsletterTemplate } from '../../../_components/email_templates/newsletter-template';
import { writeClient } from '../../../../sanity/lib/sanity.write';
import { sanityFetch } from '../../../../sanity/lib/sanity.fetch';
import { urlForImage } from '../../../../sanity/lib/sanity.image';
import { apiVersion, dataset, projectId } from '../../../../sanity/env';
import { computeContentHash, extractHashableFields } from '@/lib/newsletter/contentHash';
import { sendBroadcast } from '@/lib/newsletter/sendBroadcast';

const DOC_QUERY = `*[_id == $id][0]{
  _type, _id, "slug": slug.current, title, excerpt, date,
  coverImage{ asset->{_id, url}, crop, hotspot, alt },
  eventTitle,
  eventDays[]{ date, startTime, endTime, description },
  eventImage{ asset->{_id, url}, crop, hotspot, alt }
}`;

interface SendNowRequest {
  documentId: string;
  documentType: 'post' | 'customevent';
  expectedHash: string;
  force?: boolean;
}

async function validateSanityToken(token: string): Promise<{ ok: boolean; userName?: string }> {
  try {
    const userClient = createClient({ apiVersion, dataset, projectId, token, useCdn: false });
    const me = await userClient.users.getById('me') as { name?: string; displayName?: string };
    return { ok: true, userName: me.displayName ?? me.name };
  } catch {
    return { ok: false };
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = request.headers.get('authorization') ?? '';
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';
    if (!token) {
      return NextResponse.json({ error: 'Missing Authorization' }, { status: 401 });
    }
    const { ok } = await validateSanityToken(token);
    if (!ok) {
      return NextResponse.json({ error: 'Invalid Sanity token' }, { status: 401 });
    }

    const { documentId, documentType, expectedHash, force } = await request.json() as SendNowRequest;
    if (!documentId || !documentType || !expectedHash) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }
    if (documentType !== 'post' && documentType !== 'customevent') {
      return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
    }

    const audienceId = process.env.RESEND_AUDIENCE_ID;
    if (!audienceId) {
      return NextResponse.json({ error: 'Audience not configured' }, { status: 500 });
    }

    const document = await sanityFetch<any>({ query: DOC_QUERY, params: { id: documentId } });
    if (!document?.slug) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }

    const hashable = extractHashableFields({ ...document, _type: documentType });
    const serverHash = await computeContentHash(hashable);
    if (serverHash !== expectedHash) {
      return NextResponse.json({
        error: 'Content hash mismatch: document changed since the test was sent. Please test again.',
      }, { status: 409 });
    }

    if (!force) {
      const existing = await sanityFetch<{ newsletterStatus?: { lastSentContentHash?: string } }>({
        query: `*[_id == $id][0]{ newsletterStatus }`,
        params: { id: documentId },
      });
      if (existing?.newsletterStatus?.lastSentContentHash === serverHash) {
        return NextResponse.json({
          error: 'Already sent for this content. Pass force=true to re-send.',
          alreadySent: true,
        }, { status: 409 });
      }
    }

    const newsletterType = document._type === 'post' ? 'post' : 'event';
    const title = document.title ?? document.eventTitle ?? 'Newsletter';
    const slug = typeof document.slug === 'string' ? document.slug : document.slug?.current;
    const imageUrl = document.coverImage
      ? urlForImage(document.coverImage).url()
      : (document.eventImage ? urlForImage(document.eventImage).url() : undefined);

    const htmlBody = await render(React.createElement(NewsletterTemplate, {
      type: newsletterType, title, excerpt: document.excerpt, imageUrl, slug,
      eventDays: document.eventDays,
    }));

    const { broadcastId, recipientCount } = await sendBroadcast({
      type: newsletterType, title, excerpt: document.excerpt, slug, imageUrl,
      eventDays: document.eventDays, audienceId, htmlBody,
    });

    const sentAt = new Date().toISOString();
    const newEntry = { sentAt, trigger: 'manual', broadcastId, recipientCount };

    const current = await sanityFetch<{ newsletterStatus?: { sendHistory?: any[] } }>({
      query: `*[_id == $id][0]{ newsletterStatus }`,
      params: { id: documentId },
    });
    const history = (current?.newsletterStatus?.sendHistory ?? []).concat([newEntry]).slice(-20);

    await writeClient.patch(documentId).setIfMissing({ newsletterStatus: {} }).set({
      'newsletterStatus.lastSentAt': sentAt,
      'newsletterStatus.lastSentTrigger': 'manual',
      'newsletterStatus.lastSentBroadcastId': broadcastId,
      'newsletterStatus.lastSentRecipientCount': recipientCount,
      'newsletterStatus.lastSentContentHash': serverHash,
      'newsletterStatus.sendHistory': history,
    }).commit();

    return NextResponse.json({ success: true, broadcastId, recipientCount });
  } catch (err) {
    console.error('send-now error:', err);
    return NextResponse.json({
      error: 'Failed to send newsletter',
      details: err instanceof Error ? err.message : String(err),
    }, { status: 500 });
  }
}
```

- [ ] **Step 2: Verify route compiles**

Run `npm run dev` and open `http://localhost:3000/api/newsletter/send-now` in browser.
Expected: `{"error":"Missing Authorization"}` with status 401. Confirms route loads and auth check fires.

- [ ] **Step 3: Commit**

```bash
git add src/app/api/newsletter/send-now/route.ts
git commit -m "feat(newsletter): send-now route with Sanity token auth and content-hash gate"
```

### Task B.6: NewsletterSendButton component

**Files:**
- Create: `src/app/_components/Sanity_Components/NewsletterSendButton.tsx`
- Modify: `src/sanity/schemas/customevent.ts`
- Modify: `src/sanity/schemas/post.ts`

- [ ] **Step 1: Create the component**

Write `src/app/_components/Sanity_Components/NewsletterSendButton.tsx`:

```tsx
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Button, Stack, Card, Text, Box, Dialog } from '@sanity/ui';
import { useFormValue, useClient } from 'sanity';
import { computeContentHash, extractHashableFields } from '@/lib/newsletter/contentHash';

interface NewsletterStatus {
  lastSentAt?: string;
  lastSentContentHash?: string;
  lastTestSentAt?: string;
  lastTestContentHash?: string;
}

export default function NewsletterSendButton() {
  const documentId = useFormValue(['_id']) as string | undefined;
  const documentType = useFormValue(['_type']) as string | undefined;
  const status = (useFormValue(['newsletterStatus']) as NewsletterStatus | undefined) ?? {};

  const eventTitle = useFormValue(['eventTitle']);
  const title = useFormValue(['title']);
  const excerpt = useFormValue(['excerpt']);
  const slug = useFormValue(['slug']);
  const coverImage = useFormValue(['coverImage']);
  const eventImage = useFormValue(['eventImage']);
  const eventDays = useFormValue(['eventDays']);

  const sanityClient = useClient({ apiVersion: '2024-01-01' });

  const [currentHash, setCurrentHash] = useState<string>('');
  const [recipientCount, setRecipientCount] = useState<number | null>(null);
  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ tone: 'success' | 'critical' | 'caution'; text: string } | null>(null);

  // Compute current content hash whenever relevant fields change
  useEffect(() => {
    if (!documentType) return;
    const hashable = extractHashableFields({
      _type: documentType as 'post' | 'customevent',
      eventTitle, title, excerpt,
      coverImage, eventImage,
      slug,
      eventDays,
    } as any);
    computeContentHash(hashable).then(setCurrentHash);
  }, [documentType, eventTitle, title, excerpt, slug, coverImage, eventImage, eventDays]);

  // Fetch recipient count once
  useEffect(() => {
    fetch('/api/newsletter/recipient-count')
      .then(r => r.json())
      .then(d => setRecipientCount(typeof d.count === 'number' ? d.count : null))
      .catch(() => setRecipientCount(null));
  }, []);

  const cleanDocId = documentId?.replace(/^drafts\./, '') ?? '';
  const cleanDocType = documentType ?? '';

  const buttonState = useMemo(() => {
    if (!status.lastTestSentAt) return 'locked-no-test';
    if (status.lastTestContentHash !== currentHash) return 'locked-stale';
    if (status.lastSentContentHash === currentHash) return 'already-sent';
    return 'armed';
  }, [status, currentHash]);

  const handleSend = async (force = false) => {
    setLoading(true);
    setMessage(null);
    try {
      const token = (sanityClient.config() as any).token;
      if (!token) {
        setMessage({ tone: 'critical', text: 'Sanity-Token nicht verfügbar. Bitte neu in Studio anmelden.' });
        setLoading(false);
        return;
      }
      const res = await fetch('/api/newsletter/send-now', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          documentId: cleanDocId,
          documentType: cleanDocType,
          expectedHash: currentHash,
          force,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage({ tone: 'success', text: `Newsletter an ${data.recipientCount} Abonnenten gesendet.` });
      } else {
        setMessage({ tone: 'critical', text: data.error ?? 'Unbekannter Fehler' });
      }
    } catch (e) {
      setMessage({ tone: 'critical', text: 'Netzwerkfehler beim Senden.' });
    } finally {
      setLoading(false);
      setConfirming(false);
    }
  };

  const buttonLabel = (() => {
    switch (buttonState) {
      case 'locked-no-test': return 'Bitte erst eine Test-E-Mail senden';
      case 'locked-stale': return 'Inhalt seit Test geändert, bitte erneut testen';
      case 'already-sent': return `Bereits versendet, erneut senden? (${recipientCount ?? '?'} Empfänger)`;
      case 'armed': return `An ca. ${recipientCount ?? '?'} Abonnenten senden`;
    }
  })();

  const buttonDisabled = buttonState === 'locked-no-test' || buttonState === 'locked-stale' || loading;
  const buttonTone = buttonState === 'already-sent' ? 'caution' : 'critical';

  return (
    <Card padding={4} radius={2} shadow={1}>
      <Stack space={3}>
        <Text size={1} weight="bold">Newsletter an Abonnenten senden</Text>
        <Text size={1} muted>
          Sendet den Newsletter an alle Newsletter-Abonnenten. Vorgang ist nicht widerrufbar.
        </Text>

        <Button
          text={buttonLabel}
          tone={buttonTone}
          mode="default"
          disabled={buttonDisabled}
          loading={loading}
          onClick={() => setConfirming(true)}
        />

        {message && (
          <Box padding={2} style={{
            background: message.tone === 'success' ? '#d1fae5' : message.tone === 'caution' ? '#fef3c7' : '#fee2e2',
            borderRadius: 4,
          }}>
            <Text size={1}>{message.text}</Text>
          </Box>
        )}

        {confirming && (
          <Dialog
            id="confirm-send"
            header="Newsletter senden?"
            onClose={() => setConfirming(false)}
            footer={
              <Box padding={3}>
                <Stack space={2}>
                  <Button
                    text={`Ja, jetzt an ${recipientCount ?? '?'} Empfänger senden`}
                    tone="critical"
                    onClick={() => handleSend(buttonState === 'already-sent')}
                    loading={loading}
                  />
                  <Button text="Abbrechen" mode="ghost" onClick={() => setConfirming(false)} />
                </Stack>
              </Box>
            }
          >
            <Box padding={4}>
              <Text>
                Der Newsletter wird an {recipientCount ?? '?'} Abonnenten gesendet. Vorgang ist nicht widerrufbar.
              </Text>
            </Box>
          </Dialog>
        )}
      </Stack>
    </Card>
  );
}
```

- [ ] **Step 2: Add a host field to customevent**

In `src/sanity/schemas/customevent.ts`, add to imports:

```ts
import NewsletterSendButton from "@/app/_components/Sanity_Components/NewsletterSendButton";
```

Below the `newsletterTest` field, add:

```ts
defineField({
  name: "newsletterSend",
  title: "Newsletter senden",
  type: "string",
  components: { input: NewsletterSendButton },
  readOnly: true,
  initialValue: "",
}),
```

- [ ] **Step 3: Add a host field to post**

Same change in `src/sanity/schemas/post.ts`.

- [ ] **Step 4: Verify**

Run `npm run dev`. Open Studio, open an event.
Expected: New "Newsletter senden" section shows the button. Initial state: "Bitte erst eine Test-E-Mail senden", disabled. Send a test from the existing test button. Refresh document. Button should now read "An ca. N Abonnenten senden" and be enabled.

Edit the event title. Hash recalculates. Button reverts to "Inhalt seit Test geändert, bitte erneut testen", disabled.

- [ ] **Step 5: End-to-end manual test**

With a test audience that has at least 1 subscriber (use a personal Resend audience for safety):

1. Send test to your own email. Test arrives.
2. Click "An ca. N Abonnenten senden". Confirm modal shows.
3. Click "Ja, jetzt senden". Wait for success message.
4. Check Resend dashboard: broadcast was created and sent.
5. Refresh Studio document. NewsletterStatusPanel now shows "Versendet am … an N Abonnenten" with broadcast ID.
6. Click the button again. It should now read "Bereits versendet, erneut senden?" in caution tone.

- [ ] **Step 6: Commit**

```bash
git add src/app/_components/Sanity_Components/NewsletterSendButton.tsx src/sanity/schemas/customevent.ts src/sanity/schemas/post.ts
git commit -m "feat(studio): add NewsletterSendButton with content-hash gate and confirm dialog"
```

### Task B.7: Delete legacy /api/newsletter/send route

**Files:**
- Delete: `src/app/api/newsletter/send/route.ts`

- [ ] **Step 1: Confirm no more callers**

Run: `grep -r "/api/newsletter/send[^-]" /Users/marlinjai/software-dev/parkbad-new/src`
Expected: No matches (the webhook was deleted in A.2; nothing else calls it).

- [ ] **Step 2: Delete**

```bash
rm src/app/api/newsletter/send/route.ts
```

- [ ] **Step 3: Commit**

```bash
git add -A src/app/api/newsletter/send/
git commit -m "feat(newsletter): remove legacy send route, replaced by send-now"
```

---

## Workstream C: Contact submissions inbox

### Task C.1: contactSubmission schema

**Files:**
- Create: `src/sanity/schemas/contactSubmission.ts`
- Modify: `src/sanity/schemas/index.ts`

- [ ] **Step 1: Create the schema**

Write `src/sanity/schemas/contactSubmission.ts`:

```ts
// @ts-nocheck
import { defineField, defineType } from 'sanity';
import { EnvelopeIcon } from '@sanity/icons';
import ContactReplyPanel from '@/app/_components/Sanity_Components/ContactReplyPanel';

export default defineType({
  name: 'contactSubmission',
  title: 'Kontakt-Anfrage',
  type: 'document',
  icon: EnvelopeIcon,
  fields: [
    defineField({ name: 'firstName', title: 'Vorname', type: 'string', readOnly: true }),
    defineField({ name: 'lastName', title: 'Nachname', type: 'string', readOnly: true }),
    defineField({ name: 'email', title: 'E-Mail', type: 'string', readOnly: true }),
    defineField({ name: 'phone', title: 'Telefon', type: 'string', readOnly: true }),
    defineField({ name: 'message', title: 'Nachricht', type: 'text', readOnly: true, rows: 8 }),
    defineField({ name: 'receivedAt', title: 'Empfangen am', type: 'datetime', readOnly: true }),
    defineField({ name: 'autoReplyEmailId', type: 'string', readOnly: true, hidden: true }),
    defineField({ name: 'originalMessageId', type: 'string', readOnly: true, hidden: true }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'Offen', value: 'offen' },
          { title: 'In Bearbeitung', value: 'inBearbeitung' },
          { title: 'Erledigt', value: 'erledigt' },
        ],
        layout: 'radio',
      },
      initialValue: 'offen',
    }),
    defineField({ name: 'internalNotes', title: 'Interne Notizen', type: 'text', rows: 4 }),
    defineField({
      name: 'replies',
      title: 'Antworten',
      type: 'array',
      readOnly: true,
      of: [{
        type: 'object',
        fields: [
          defineField({ name: 'sentAt', type: 'datetime' }),
          defineField({ name: 'sentBy', type: 'string' }),
          defineField({ name: 'body', type: 'text' }),
          defineField({ name: 'resendEmailId', type: 'string' }),
        ],
        preview: {
          select: { sentAt: 'sentAt', sentBy: 'sentBy', body: 'body' },
          prepare: ({ sentAt, sentBy, body }) => ({
            title: `${new Date(sentAt).toLocaleString('de-DE')} - ${sentBy}`,
            subtitle: body?.slice(0, 80),
          }),
        },
      }],
    }),
    defineField({
      name: 'replyComposer',
      title: 'Antworten',
      type: 'string',
      components: { input: ContactReplyPanel },
      readOnly: true,
      initialValue: '',
    }),
  ],
  preview: {
    select: { firstName: 'firstName', lastName: 'lastName', message: 'message', status: 'status', receivedAt: 'receivedAt' },
    prepare: ({ firstName, lastName, message, status, receivedAt }) => {
      const statusLabel = status === 'erledigt' ? '✓' : status === 'inBearbeitung' ? '…' : '●';
      return {
        title: `${statusLabel} ${firstName ?? ''} ${lastName ?? ''}`.trim(),
        subtitle: `${receivedAt ? new Date(receivedAt).toLocaleDateString('de-DE') : ''} ${message?.slice(0, 60) ?? ''}`,
      };
    },
  },
  orderings: [
    { name: 'receivedAtDesc', title: 'Neueste zuerst', by: [{ field: 'receivedAt', direction: 'desc' }] },
  ],
});
```

- [ ] **Step 2: Register the schema**

Read `src/sanity/schemas/index.ts`. Add to the imports and to the exported `schemaTypes` array (or whatever the export pattern is). Example addition:

```ts
import contactSubmission from './contactSubmission';
// ...
export const schemaTypes = [/* existing */, contactSubmission];
```

Match the existing file's actual export pattern.

- [ ] **Step 3: Verify Studio loads**

Run `npm run dev:local`. Open `http://localhost:3000/admin`.
Expected: Sidebar shows new "Kontakt-Anfrage" entry. Loading it shows empty list. Loading the schema does not error in the console (NOTE: ContactReplyPanel doesn't exist yet, so the field referencing it will fail. Either temporarily comment out the `replyComposer` field, or proceed to C.4 first.)

Recommended: do C.4 (ContactReplyPanel component) BEFORE this verification, then come back.

- [ ] **Step 4: Commit**

```bash
git add src/sanity/schemas/contactSubmission.ts src/sanity/schemas/index.ts
git commit -m "feat(schema): add contactSubmission for storing form submissions"
```

### Task C.2: Persist submission in contact form route

**Files:**
- Modify: `src/app/api/send/route.ts`

- [ ] **Step 1: Add import and persistence step**

In `src/app/api/send/route.ts`, add at top with other imports:

```ts
import { writeClient } from "../../../sanity/lib/sanity.write";
import { randomUUID } from "crypto";
```

Inside the `POST` function, after the `teamNotification` send succeeds and BEFORE the auto-reply block, generate a `messageId` and use it on the team notification. Replace the existing `teamNotification` send block with:

```ts
const messageId = `<${randomUUID()}@parkbad-gt.de>`;

const teamNotification = await resend.emails.send({
  from: "kontakt@parkbad-gt.de",
  to: ["verwaltung@parkbad-gt.de"],
  subject: `Neue Nachricht von ${requestBody.firstName} ${requestBody.lastName}`,
  headers: { 'Message-ID': messageId },
  // ... existing react and text args unchanged
  react: /* keep as-is */,
  text: /* keep as-is */,
});
```

After the auto-reply block (inside the same try/catch outer structure but as its own try/catch), persist:

```ts
try {
  await writeClient.create({
    _type: 'contactSubmission',
    firstName: requestBody.firstName,
    lastName: requestBody.lastName,
    email: requestBody.email,
    phone: requestBody.phone,
    message: requestBody.message,
    receivedAt: new Date().toISOString(),
    autoReplyEmailId: (autoReply as any)?.data?.id ?? null,
    originalMessageId: messageId,
    status: 'offen',
  });
} catch (persistErr) {
  console.error('Failed to persist contact submission:', persistErr);
  // Do not fail the request: email already sent, that's the user-facing success
}
```

NOTE: `autoReply` is currently scoped inside the auto-reply try block. Move its declaration to a shared `let autoReply: any = null;` above the try block so the persistence code can reference it.

- [ ] **Step 2: Verify**

Run `npm run dev`. Use the public contact form on the site (or POST manually):

```bash
curl -X POST http://localhost:3000/api/send \
  -H 'Content-Type: application/json' \
  -d '{"firstName":"Test","lastName":"User","email":"test@example.com","phone":"+49 123","message":"Hallo Welt"}'
```

Expected: Both emails sent. Open Studio, navigate to Kontakt-Anfrage. New submission appears with all fields populated and status "offen".

- [ ] **Step 3: Commit**

```bash
git add src/app/api/send/route.ts
git commit -m "feat(contact): persist form submissions to Sanity for inbox visibility"
```

### Task C.3: Studio structure node

**Files:**
- Modify: `src/sanity/desk/structure.ts`

- [ ] **Step 1: Replace structure with explicit listing**

Replace the contents of `src/sanity/desk/structure.ts` with:

```ts
import { StructureBuilder } from 'sanity/structure';
import { EnvelopeIcon } from '@sanity/icons';

export const structure = (S: StructureBuilder) =>
  S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('Kontakt-Anfragen')
        .icon(EnvelopeIcon)
        .child(
          S.list()
            .title('Kontakt-Anfragen')
            .items([
              S.listItem()
                .title('Offen')
                .child(
                  S.documentList()
                    .title('Offen')
                    .filter('_type == "contactSubmission" && status == "offen"')
                    .defaultOrdering([{ field: 'receivedAt', direction: 'desc' }])
                ),
              S.listItem()
                .title('In Bearbeitung')
                .child(
                  S.documentList()
                    .title('In Bearbeitung')
                    .filter('_type == "contactSubmission" && status == "inBearbeitung"')
                    .defaultOrdering([{ field: 'receivedAt', direction: 'desc' }])
                ),
              S.listItem()
                .title('Erledigt')
                .child(
                  S.documentList()
                    .title('Erledigt')
                    .filter('_type == "contactSubmission" && status == "erledigt"')
                    .defaultOrdering([{ field: 'receivedAt', direction: 'desc' }])
                ),
              S.listItem()
                .title('Alle')
                .child(
                  S.documentList()
                    .title('Alle Kontakt-Anfragen')
                    .filter('_type == "contactSubmission"')
                    .defaultOrdering([{ field: 'receivedAt', direction: 'desc' }])
                ),
            ])
        ),
      S.divider(),
      // Auto-list all other document types except mediaTag and contactSubmission
      ...S.documentTypeListItems().filter(item => {
        const id = item.getId();
        return id !== 'mediaTag' && id !== 'contactSubmission';
      }),
    ]);
```

- [ ] **Step 2: Verify**

Run `npm run dev:local`, open Studio.
Expected: "Kontakt-Anfragen" appears at top with sub-views. Create a test submission via the API. Confirm it appears under "Offen". Change its status to "Erledigt", refresh: it moves to "Erledigt".

- [ ] **Step 3: Commit**

```bash
git add src/sanity/desk/structure.ts
git commit -m "feat(studio): add Kontakt-Anfragen structure node with status views"
```

### Task C.4: ContactReplyPanel component

**Files:**
- Create: `src/app/_components/Sanity_Components/ContactReplyPanel.tsx`

- [ ] **Step 1: Create the component**

Write `src/app/_components/Sanity_Components/ContactReplyPanel.tsx`:

```tsx
'use client';

import React, { useState } from 'react';
import { Button, Card, Stack, Text, TextArea, Box, Badge } from '@sanity/ui';
import { useFormValue, useClient } from 'sanity';

interface Reply {
  sentAt?: string;
  sentBy?: string;
  body?: string;
  resendEmailId?: string;
}

export default function ContactReplyPanel() {
  const documentId = useFormValue(['_id']) as string | undefined;
  const email = useFormValue(['email']) as string | undefined;
  const firstName = useFormValue(['firstName']) as string | undefined;
  const message = useFormValue(['message']) as string | undefined;
  const replies = (useFormValue(['replies']) as Reply[] | undefined) ?? [];

  const sanityClient = useClient({ apiVersion: '2024-01-01' });

  const [body, setBody] = useState('');
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ tone: 'success' | 'critical'; text: string } | null>(null);

  const cleanDocId = documentId?.replace(/^drafts\./, '') ?? '';

  const handleSend = async () => {
    if (!body.trim()) return;
    setLoading(true);
    setFeedback(null);
    try {
      const token = (sanityClient.config() as any).token;
      if (!token) {
        setFeedback({ tone: 'critical', text: 'Sanity-Token nicht verfügbar.' });
        setLoading(false);
        return;
      }
      const res = await fetch('/api/contact/reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ submissionId: cleanDocId, body }),
      });
      const data = await res.json();
      if (res.ok) {
        setFeedback({ tone: 'success', text: 'Antwort gesendet.' });
        setBody('');
      } else {
        setFeedback({ tone: 'critical', text: data.error ?? 'Fehler' });
      }
    } catch {
      setFeedback({ tone: 'critical', text: 'Netzwerkfehler.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Stack space={4}>
      <Card padding={4} radius={2} tone="transparent" border>
        <Stack space={2}>
          <Text size={1} weight="bold">Ursprüngliche Nachricht</Text>
          <Text size={2} style={{ whiteSpace: 'pre-wrap' }}>{message ?? ''}</Text>
        </Stack>
      </Card>

      {replies.length > 0 && (
        <Stack space={2}>
          <Text size={1} weight="bold">Bisherige Antworten</Text>
          {replies.map((r, i) => (
            <Card key={i} padding={3} radius={2} tone="primary" border>
              <Stack space={2}>
                <Box>
                  <Badge tone="primary">{r.sentBy ?? 'Studio'}</Badge>
                  <Text size={0} muted style={{ marginLeft: 8 }}>
                    {r.sentAt ? new Date(r.sentAt).toLocaleString('de-DE') : ''}
                  </Text>
                </Box>
                <Text size={2} style={{ whiteSpace: 'pre-wrap' }}>{r.body ?? ''}</Text>
              </Stack>
            </Card>
          ))}
        </Stack>
      )}

      <Card padding={4} radius={2} shadow={1}>
        <Stack space={3}>
          <Text size={1} weight="bold">Antworten an {firstName ?? email}</Text>
          <Text size={1} muted>
            Antworten Sie hier, damit das Gespräch dokumentiert ist. Die E-Mail wird von verwaltung@parkbad-gt.de gesendet und im Postfach des Empfängers korrekt im Thread angezeigt.
          </Text>
          <TextArea
            rows={6}
            placeholder="Ihre Antwort..."
            value={body}
            onChange={e => setBody(e.currentTarget.value)}
            disabled={loading}
          />
          <Button
            text={loading ? 'Wird gesendet...' : 'Senden als verwaltung@parkbad-gt.de'}
            tone="primary"
            disabled={loading || !body.trim()}
            loading={loading}
            onClick={handleSend}
          />
          {feedback && (
            <Box padding={2} style={{
              background: feedback.tone === 'success' ? '#d1fae5' : '#fee2e2',
              borderRadius: 4,
            }}>
              <Text size={1}>{feedback.text}</Text>
            </Box>
          )}
        </Stack>
      </Card>
    </Stack>
  );
}
```

- [ ] **Step 2: Verify it imports cleanly**

Run `npm run dev:local`. Open Studio, navigate to a contact submission.
Expected: Reply panel renders. Original message shows. Empty replies list (none yet). Composer is visible. Sending will fail with 404 since the route doesn't exist yet. That's fine, fixed in C.5.

- [ ] **Step 3: Commit**

```bash
git add src/app/_components/Sanity_Components/ContactReplyPanel.tsx
git commit -m "feat(studio): add ContactReplyPanel for inbox replies"
```

### Task C.5: /api/contact/reply route

**Files:**
- Create: `src/app/api/contact/reply/route.ts`

- [ ] **Step 1: Create the route**

Write `src/app/api/contact/reply/route.ts`:

```ts
import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { createClient } from 'next-sanity';
import { writeClient } from '../../../../sanity/lib/sanity.write';
import { sanityFetch } from '../../../../sanity/lib/sanity.fetch';
import { apiVersion, dataset, projectId } from '../../../../sanity/env';

const resend = new Resend(process.env.RESEND_API_KEY);

interface ReplyRequest {
  submissionId: string;
  body: string;
}

interface SubmissionDoc {
  email?: string;
  firstName?: string;
  lastName?: string;
  originalMessageId?: string;
  status?: string;
  replies?: Array<unknown>;
}

async function validateSanityToken(token: string): Promise<{ ok: boolean; userName?: string }> {
  try {
    const userClient = createClient({ apiVersion, dataset, projectId, token, useCdn: false });
    const me = await userClient.users.getById('me') as { name?: string; displayName?: string; email?: string };
    return { ok: true, userName: me.displayName ?? me.name ?? me.email ?? 'Studio' };
  } catch {
    return { ok: false };
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = request.headers.get('authorization') ?? '';
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';
    if (!token) return NextResponse.json({ error: 'Missing Authorization' }, { status: 401 });

    const { ok, userName } = await validateSanityToken(token);
    if (!ok) return NextResponse.json({ error: 'Invalid Sanity token' }, { status: 401 });

    const { submissionId, body } = await request.json() as ReplyRequest;
    if (!submissionId || !body?.trim()) {
      return NextResponse.json({ error: 'Missing submissionId or body' }, { status: 400 });
    }

    const submission = await sanityFetch<SubmissionDoc>({
      query: `*[_type == "contactSubmission" && _id == $id][0]{ email, firstName, lastName, originalMessageId, status, replies }`,
      params: { id: submissionId },
    });

    if (!submission?.email) {
      return NextResponse.json({ error: 'Submission not found or missing email' }, { status: 404 });
    }

    const headers: Record<string, string> = {
      'X-Mailer': 'Parkbad Gütersloh Contact Reply',
    };
    if (submission.originalMessageId) {
      headers['In-Reply-To'] = submission.originalMessageId;
      headers['References'] = submission.originalMessageId;
    }

    const send = await resend.emails.send({
      from: 'Parkbad Gütersloh <verwaltung@parkbad-gt.de>',
      to: [submission.email],
      replyTo: 'verwaltung@parkbad-gt.de',
      subject: 'Re: Ihre Anfrage an Parkbad Gütersloh',
      headers,
      text: `Hallo ${submission.firstName ?? ''},\n\n${body}\n\nMit freundlichen Grüßen\nIhr Team vom Parkbad Gütersloh`,
    });

    if (send.error) {
      return NextResponse.json({ error: 'Failed to send reply', details: send.error }, { status: 500 });
    }

    const replyEntry = {
      sentAt: new Date().toISOString(),
      sentBy: userName ?? 'Studio',
      body,
      resendEmailId: send.data?.id ?? '',
    };

    const newReplies = (submission.replies ?? []).concat([replyEntry]);
    const newStatus = submission.status === 'offen' ? 'inBearbeitung' : submission.status;

    await writeClient.patch(submissionId).set({
      replies: newReplies,
      status: newStatus,
    }).commit();

    return NextResponse.json({ success: true, emailId: send.data?.id });
  } catch (err) {
    console.error('contact reply error:', err);
    return NextResponse.json({
      error: 'Failed to send reply',
      details: err instanceof Error ? err.message : String(err),
    }, { status: 500 });
  }
}
```

- [ ] **Step 2: Verify auth gate**

Run `npm run dev`. Test with no auth:

```bash
curl -X POST http://localhost:3000/api/contact/reply \
  -H 'Content-Type: application/json' \
  -d '{"submissionId":"x","body":"y"}'
```

Expected: `{"error":"Missing Authorization"}` 401.

- [ ] **Step 3: End-to-end manual reply test**

In Studio:
1. Open a submission (use one created earlier, or POST a new one to your own email).
2. Type a reply in the composer.
3. Click "Senden als verwaltung@parkbad-gt.de".
4. Expected: green "Antwort gesendet." Reply appears in "Bisherige Antworten" list (after page refresh). Status changes from "Offen" to "In Bearbeitung". Customer email arrives, threaded under the original confirmation in the customer's mail client.

- [ ] **Step 4: Commit**

```bash
git add src/app/api/contact/reply/route.ts
git commit -m "feat(contact): reply route with Sanity auth and email threading"
```

---

## Workstream Z: Final integration & cleanup

### Task Z.1: Cross-workstream smoke test

- [ ] **Step 1: Full event-to-newsletter flow**

In Studio (with Infisical-wrapped dev):
1. Create a new event with title, excerpt, image, one event day.
2. Send test email to your own address. Confirm arrival.
3. Confirm NewsletterSendButton enables.
4. Click and confirm send. Confirm email arrives at all real subscribers (or test audience).
5. Confirm NewsletterStatusPanel shows the send.

- [ ] **Step 2: Full contact-form flow**

1. Submit the contact form on the public site.
2. Confirm both emails arrive (team notification + auto-reply to customer).
3. Confirm new contactSubmission appears in Studio.
4. Reply from Studio. Confirm customer receives the reply, threaded.
5. Confirm status flips to "In Bearbeitung".
6. Mark status "Erledigt" in Studio. Confirm document moves to "Erledigt" view.

- [ ] **Step 3: Re-send protection check**

1. On the same event from Step 1, try to send again. Button should show "Bereits versendet, erneut senden?".
2. Click. Confirm modal. Click confirm. Send succeeds, recipient count and broadcast ID update, sendHistory grows by one.

### Task Z.2: Update README/CLAUDE.md if relevant

**Files:**
- Maybe modify: `README.md`

- [ ] **Step 1: Check README**

Read `README.md`. If it documents the newsletter flow or admin features, update those sections to reflect:
- Newsletter is now manual (not auto-on-publish)
- Test required before send
- Contact form submissions persist in Studio

If README does not cover this area, skip the task.

- [ ] **Step 2: Commit (if modified)**

```bash
git add README.md
git commit -m "docs: update README for new newsletter and contact admin flow"
```

### Task Z.3: Final TypeScript and lint pass

- [ ] **Step 1: Type-check**

Run: `npx tsc --noEmit`
Expected: No new errors. Fix any related to the new files.

- [ ] **Step 2: Lint**

Run: `npm run lint`
Expected: No new errors in the files touched by this plan.

- [ ] **Step 3: Final commit if anything was fixed**

```bash
git add -A
git commit -m "chore: typecheck and lint cleanup"
```

---

## Self-review checklist (for the implementing engineer)

Before declaring done, verify:

1. Publishing an event without using the new send button does NOT cause a newsletter to be sent.
2. The Studio form for an event/post shows current send-status visibly.
3. The send button is disabled until a successful test of the same content has been sent.
4. Editing the document content after a test re-disables the send button.
5. A second send for the same content requires explicit re-confirmation.
6. A contact form submission appears as a Sanity doc within seconds.
7. Replies sent from Studio arrive at the customer in a threaded conversation.
8. `SANITY_API_WRITE_TOKEN` is set in Infisical for both `dev` and `prod`.
9. The Sanity webhook for `/api/newsletter/webhook` has been removed in Sanity manage.

## Out of scope (explicit reminders)

- Inbound email parsing (capturing email-client replies back into Sanity).
- Migration script for stripping legacy `sendNewsletter` field from existing docs.
- Per-Studio-user inbox assignment / routing.
- Recipient list segmentation.
- Rate limiting on the new write endpoints.
