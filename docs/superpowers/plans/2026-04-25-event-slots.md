# Multi-Slot Event Days Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Let `customevent.eventDays[]` rows nest a `slots[]` array so a single day can hold multiple time ranges with labels, rendered stacked on cards, the detail page, and the newsletter.

**Architecture:** Schema change introduces a nested `slots[]` array on each event day. A one-shot migration script converts existing data. A small shared helper `normalizeEventDays` is used by every consumer (renderers, content hash, newsletter). Single-slot days render unchanged for visual backwards compatibility; multi-slot days render as a date heading with indented labeled slots beneath.

**Tech Stack:** Sanity 4 schema with custom validation, Next.js 15 / React 19 components, react-email for the newsletter template, vitest for the pure-logic helper.

**Spec:** `docs/superpowers/specs/2026-04-25-event-slots-design.md`

**Working directory:** `/Users/marlinjai/software-dev/parkbad-new` (main branch). No worktree per project convention (see memory: feedback_workflow_no_pr).

---

## File map

**New files:**
- `src/lib/events/eventDays.ts` : shared `normalizeEventDays` helper + `Slot` / `EventDay` / `NormalizedDay` types
- `src/lib/events/eventDays.test.ts` : vitest unit tests
- `scripts/migrate-event-days-to-slots.ts` : one-shot migration

**Modified:**
- `src/sanity/schemas/customevent.ts` : replace flat eventDays with nested slots
- `src/types/componentTypes.ts` : update `EventDay` type
- `src/types/sanityTypes.ts` : update `EventDay` type (duplicate definition, keep both in sync)
- `src/app/_components/Homepage_Components/RenderDate.tsx` : render single vs multi-slot
- `src/app/_components/email_templates/newsletter-template.tsx` : render single vs multi-slot
- `src/app/api/newsletter/test/route.ts` : update GROQ projection for slots
- `src/app/api/newsletter/send-now/route.ts` : update GROQ projection for slots
- `src/lib/newsletter/contentHash.ts` : include slots in hashable shape
- `src/lib/newsletter/contentHash.test.ts` : update test fixtures

`Archive.tsx` and `PostCardsSlider.tsx` only access `eventDays[0].date` and don't touch `startTime`/`endTime`, so they need no logic changes (just type alignment via the updated `EventDay` type).

---

## Task 1: normalizeEventDays helper

**Files:**
- Create: `src/lib/events/eventDays.ts`
- Create: `src/lib/events/eventDays.test.ts`

- [ ] **Step 1: Write the failing test**

Write `src/lib/events/eventDays.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { normalizeEventDays } from './eventDays';

describe('normalizeEventDays', () => {
  it('returns empty array for undefined input', () => {
    expect(normalizeEventDays(undefined)).toEqual([]);
  });

  it('returns empty array for empty input', () => {
    expect(normalizeEventDays([])).toEqual([]);
  });

  it('preserves a single-slot day and marks isMultiSlot false', () => {
    const out = normalizeEventDays([
      { date: '2026-05-01', slots: [{ startTime: '15:00', endTime: '20:00' }] },
    ]);
    expect(out).toEqual([
      {
        date: '2026-05-01',
        slots: [{ startTime: '15:00', endTime: '20:00' }],
        isMultiSlot: false,
      },
    ]);
  });

  it('marks a multi-slot day and sorts slots by startTime', () => {
    const out = normalizeEventDays([
      {
        date: '2026-05-01',
        slots: [
          { startTime: '19:00', endTime: '22:00', label: 'Band' },
          { startTime: '12:00', endTime: '22:00', label: 'Hauptevent' },
        ],
      },
    ]);
    expect(out[0].isMultiSlot).toBe(true);
    expect(out[0].slots.map(s => s.startTime)).toEqual(['12:00', '19:00']);
    expect(out[0].slots[0].label).toBe('Hauptevent');
  });

  it('handles a day with empty slots array', () => {
    const out = normalizeEventDays([{ date: '2026-05-01', slots: [] }]);
    expect(out).toEqual([{ date: '2026-05-01', slots: [], isMultiSlot: false }]);
  });

  it('does not mutate the input', () => {
    const input = [{
      date: '2026-05-01',
      slots: [
        { startTime: '19:00', endTime: '22:00', label: 'B' },
        { startTime: '12:00', endTime: '22:00', label: 'A' },
      ],
    }];
    const before = JSON.stringify(input);
    normalizeEventDays(input);
    expect(JSON.stringify(input)).toBe(before);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- eventDays`
Expected: FAIL with `Cannot find module './eventDays'`.

- [ ] **Step 3: Implement the helper**

Write `src/lib/events/eventDays.ts`:

```ts
export interface Slot {
  startTime: string;
  endTime: string;
  label?: string;
}

export interface EventDay {
  date: string;
  slots: Slot[];
}

export interface NormalizedDay {
  date: string;
  slots: Slot[];
  isMultiSlot: boolean;
}

export function normalizeEventDays(days: EventDay[] | undefined): NormalizedDay[] {
  if (!days) return [];
  return days.map(d => {
    const sorted = [...(d.slots ?? [])].sort((a, b) => a.startTime.localeCompare(b.startTime));
    return {
      date: d.date,
      slots: sorted,
      isMultiSlot: sorted.length > 1,
    };
  });
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- eventDays`
Expected: All 6 tests pass.

- [ ] **Step 5: Commit**

```bash
git add src/lib/events/eventDays.ts src/lib/events/eventDays.test.ts
git commit -m "feat(events): normalizeEventDays helper for slot-aware rendering"
```

---

## Task 2: Update EventDay TypeScript types

**Files:**
- Modify: `src/types/componentTypes.ts`
- Modify: `src/types/sanityTypes.ts`

- [ ] **Step 1: Update componentTypes.ts**

In `src/types/componentTypes.ts`, locate the `EventDay` type (search for `export type EventDay`). Replace it with:

```ts
export type Slot = {
  startTime: string;
  endTime: string;
  label?: string;
};

export type EventDay = {
  date: string;
  slots: Slot[];
};
```

- [ ] **Step 2: Update sanityTypes.ts**

`src/types/sanityTypes.ts` has its own `EventDay` definition (duplicate). Locate it and replace with the same shape:

```ts
export type Slot = {
  startTime: string;
  endTime: string;
  label?: string;
};

export type EventDay = {
  date: string;
  slots: Slot[];
};
```

If either file already imports from the other, delete the duplicate and keep one canonical definition. If they're independent (current state), update both.

- [ ] **Step 3: Type-check**

Run: `npx tsc --noEmit 2>&1 | grep -v "node_modules\|asset\|Logo" | head -20`

Expected output: errors in places that still reference `eventDay.startTime`, `eventDay.endTime`, or `eventDay.description` directly. These are the consumer files we will update in subsequent tasks. Note the count of errors so the next tasks can verify they're fixing them.

- [ ] **Step 4: Commit**

```bash
git add src/types/componentTypes.ts src/types/sanityTypes.ts
git commit -m "feat(types): EventDay nests slots[] with optional label"
```

---

## Task 3: Update customevent schema

**Files:**
- Modify: `src/sanity/schemas/customevent.ts`

- [ ] **Step 1: Read the current schema**

Open `src/sanity/schemas/customevent.ts`. Locate the `eventDays` defineField (around line 173). Note the `Array.from({ length: 48 }, ...)` block that builds the half-hour list : it appears twice (once for startTime, once for endTime). You will extract it to a const at the top of the file and reuse.

- [ ] **Step 2: Add the half-hour list constant near the top**

After the imports in `src/sanity/schemas/customevent.ts`, before `export default defineType({`, add:

```ts
const HALF_HOUR_LIST = Array.from({ length: 48 }, (_, i) => {
  const hour = Math.floor(i / 2);
  const minute = i % 2 === 0 ? "00" : "30";
  const value = `${hour.toString().padStart(2, "0")}:${minute}`;
  return { title: value, value };
});
```

- [ ] **Step 3: Replace the eventDays defineField**

Replace the entire `eventDays` defineField block (the existing one with flat `startTime`, `endTime`, `description` fields) with:

```ts
defineField({
  name: "eventDays",
  title: "Veranstaltungstage",
  type: "array",
  validation: (rule) => rule.required().min(1),
  of: [
    {
      type: "object",
      fields: [
        defineField({
          name: "date",
          title: "Datum",
          type: "date",
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: "slots",
          title: "Zeitfenster",
          type: "array",
          validation: (rule) => rule.required().min(1),
          of: [
            {
              type: "object",
              fields: [
                defineField({
                  name: "startTime",
                  title: "Startzeit",
                  type: "string",
                  options: { list: HALF_HOUR_LIST },
                  validation: (rule) => rule.required(),
                }),
                defineField({
                  name: "endTime",
                  title: "Endzeit",
                  type: "string",
                  options: { list: HALF_HOUR_LIST },
                  validation: (rule) => rule.required(),
                }),
                defineField({
                  name: "label",
                  title: "Bezeichnung (Pflicht bei mehreren Zeitfenstern)",
                  type: "string",
                  validation: (rule) =>
                    rule.custom((label, context) => {
                      // context.parent is the slot object; we need the parent day's slots array.
                      // Walk context.path which looks like ['eventDays', dayIdx, 'slots', slotIdx, 'label']
                      const path = context.path;
                      const dayIdx = path[1];
                      if (typeof dayIdx !== "number") return true;
                      const doc = context.document as any;
                      const slots = doc?.eventDays?.[dayIdx]?.slots ?? [];
                      if (slots.length > 1 && !label?.trim()) {
                        return "Bei mehreren Zeitfenstern ist eine Bezeichnung erforderlich.";
                      }
                      return true;
                    }),
                }),
              ],
              preview: {
                select: { startTime: "startTime", endTime: "endTime", label: "label" },
                prepare: ({ startTime, endTime, label }) => ({
                  title: `${startTime} - ${endTime}`,
                  subtitle: label || "ohne Bezeichnung",
                }),
              },
            },
          ],
        }),
      ],
      preview: {
        select: { date: "date", slots: "slots" },
        prepare: ({ date, slots }) => {
          const dateStr = date ? new Date(date).toLocaleDateString("de-DE") : "kein Datum";
          const slotCount = (slots ?? []).length;
          if (slotCount === 0) {
            return { title: dateStr, subtitle: "keine Zeitfenster" };
          }
          if (slotCount === 1) {
            const s = slots[0];
            const labelPart = s.label ? ` · ${s.label}` : "";
            return { title: dateStr, subtitle: `${s.startTime} - ${s.endTime}${labelPart}` };
          }
          return { title: dateStr, subtitle: `${slotCount} Zeitfenster` };
        },
      },
    },
  ],
}),
```

- [ ] **Step 4: Update showUntilDate initialValue**

The schema field `showUntilDate` (further down the file) has an `initialValue` function that scans `eventDays` for the last day. Update it to use the new shape. Find the existing initialValue and replace its body with:

```ts
initialValue: (_, context) => {
  const document = context?.document;
  const days = (document?.eventDays as Array<{ date?: string; slots?: Array<{ endTime?: string }> }>) ?? [];
  if (days.length > 0) {
    const sortedDays = [...days].sort(
      (a, b) => new Date(a.date ?? 0).getTime() - new Date(b.date ?? 0).getTime()
    );
    const lastDay = sortedDays[sortedDays.length - 1];
    if (lastDay?.date) {
      const lastDate = new Date(lastDay.date);
      // Find latest endTime among slots; fall back to end of day
      const slots = lastDay.slots ?? [];
      const latestEnd = slots.reduce<string | null>((acc, s) => {
        if (!s.endTime) return acc;
        if (!acc || s.endTime.localeCompare(acc) > 0) return s.endTime;
        return acc;
      }, null);
      if (latestEnd) {
        const [hh, mm] = latestEnd.split(":").map(Number);
        lastDate.setHours(hh, mm, 0, 0);
      } else {
        lastDate.setHours(23, 59, 59, 999);
      }
      return lastDate.toISOString();
    }
  }
  const fallbackDate = new Date();
  fallbackDate.setDate(fallbackDate.getDate() + 30);
  return fallbackDate.toISOString();
},
```

- [ ] **Step 5: Verify Studio loads**

Start the dev server: `npm run dev` (in the background, or in another terminal). Open `http://localhost:3000/admin`. Open any existing event document.

Expected at this point: Sanity will show an "Unknown field" warning for the legacy `startTime` / `endTime` / `description` fields on eventDays rows that haven't been migrated yet. That's expected : Task 4's migration script will clean it up. The new structure should be visible (date + slots accordion).

If the form errors out fatally, stop and report : schema validation issue.

- [ ] **Step 6: Commit**

```bash
git add src/sanity/schemas/customevent.ts
git commit -m "feat(schema): nest slots[] inside eventDays for multi-time-window support"
```

---

## Task 4: Migration script

**Files:**
- Create: `scripts/migrate-event-days-to-slots.ts`

- [ ] **Step 1: Write the script**

Write `scripts/migrate-event-days-to-slots.ts`:

```ts
// scripts/migrate-event-days-to-slots.ts
// One-shot: convert eventDays[].{startTime,endTime,description} to eventDays[].slots[].
//
// Run with:
//   infisical run --env=dev -- npx tsx scripts/migrate-event-days-to-slots.ts [--dry-run]
//   infisical run --env=prod -- npx tsx scripts/migrate-event-days-to-slots.ts
//
// Idempotent: skips documents where any eventDays[i].slots is already defined.

import { createClient } from '@sanity/client';

const DRY_RUN = process.argv.includes('--dry-run');

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_WRITE_TOKEN!,
  useCdn: false,
});

interface LegacyDay {
  date?: string;
  startTime?: string;
  endTime?: string;
  description?: string;
  slots?: unknown;
}

interface NewSlot {
  _key?: string;
  _type?: string;
  startTime: string;
  endTime: string;
  label?: string;
}

interface NewDay {
  _key?: string;
  _type?: string;
  date: string;
  slots: NewSlot[];
}

function randomKey(): string {
  return Math.random().toString(36).slice(2, 14);
}

async function main() {
  console.log(`Mode: ${DRY_RUN ? 'DRY RUN (no writes)' : 'LIVE'}`);
  console.log('Fetching customevent documents...');

  const docs = await client.fetch<Array<{ _id: string; eventDays?: LegacyDay[] }>>(
    `*[_type == "customevent" && defined(eventDays)]{ _id, eventDays }`
  );

  console.log(`Found ${docs.length} customevent document(s).`);

  let migrated = 0;
  let alreadyNew = 0;
  let skippedNoLegacyData = 0;
  let errors = 0;

  for (const doc of docs) {
    const days = doc.eventDays ?? [];

    const hasNewShape = days.some(d => Array.isArray(d.slots));
    if (hasNewShape) {
      console.log(`  ${doc._id}: already migrated, skip`);
      alreadyNew += 1;
      continue;
    }

    const hasLegacyData = days.some(d => d.startTime || d.endTime);
    if (!hasLegacyData) {
      console.log(`  ${doc._id}: no legacy time data, skip`);
      skippedNoLegacyData += 1;
      continue;
    }

    const newDays: NewDay[] = days.map(d => {
      const slots: NewSlot[] = [];
      if (d.startTime && d.endTime) {
        slots.push({
          _key: randomKey(),
          _type: 'object',
          startTime: d.startTime,
          endTime: d.endTime,
          label: d.description?.trim() || undefined,
        });
      }
      return {
        _key: randomKey(),
        _type: 'object',
        date: d.date ?? '',
        slots,
      };
    });

    console.log(`  ${doc._id}: migrating ${days.length} day(s)`);

    if (DRY_RUN) {
      console.log(`    would write: ${JSON.stringify(newDays).slice(0, 200)}...`);
      migrated += 1;
      continue;
    }

    try {
      await client.patch(doc._id).set({ eventDays: newDays }).commit();
      migrated += 1;
    } catch (err: any) {
      console.error(`    error: ${err?.message ?? err}`);
      errors += 1;
    }
  }

  console.log('\nSummary:');
  console.log(`  migrated:           ${migrated}`);
  console.log(`  already new shape:  ${alreadyNew}`);
  console.log(`  no legacy data:     ${skippedNoLegacyData}`);
  console.log(`  errors:             ${errors}`);
  if (DRY_RUN) {
    console.log('\nDry-run only. Re-run without --dry-run to apply.');
  }
}

main().catch(err => {
  console.error('Fatal:', err);
  process.exit(1);
});
```

- [ ] **Step 2: Dry-run against dev dataset**

```bash
cd /Users/marlinjai/software-dev/parkbad-new
infisical run --env=dev -- npx tsx scripts/migrate-event-days-to-slots.ts --dry-run
```

Expected output: lists each `customevent` document with how many days it would migrate, plus a summary. No data should be written.

Verify the proposed shape looks right (slots array with one entry per legacy day, label from description if it had one).

- [ ] **Step 3: Real run against dev dataset**

```bash
infisical run --env=dev -- npx tsx scripts/migrate-event-days-to-slots.ts
```

Expected: same listing but with actual writes. Verify no errors in the summary.

- [ ] **Step 4: Verify in Studio**

Refresh the Studio tab. Open an event. The "Unknown field" warning from Task 3 step 5 should be gone. Each day now shows the new accordion with one slot inside.

- [ ] **Step 5: Commit**

```bash
git add scripts/migrate-event-days-to-slots.ts
git commit -m "chore(scripts): one-shot migration of eventDays to nested slots"
```

(Production run happens at deploy time, not now. Note in the deploy checklist.)

---

## Task 5: Update RenderDate.tsx

**Files:**
- Modify: `src/app/_components/Homepage_Components/RenderDate.tsx`

This is the largest renderer change. The current logic groups days by identical `(startTime, endTime)` to collapse repeated time ranges. With slots, we drop the grouping logic and render each day individually: single-slot days as one line, multi-slot days as a heading with indented slots beneath.

- [ ] **Step 1: Replace the eventDays branch**

Open `src/app/_components/Homepage_Components/RenderDate.tsx`. Replace the entire `if (event.eventDays && event.eventDays.length > 0)` block (lines 37 to 94 in the current file) with:

```tsx
  if (event.eventDays && event.eventDays.length > 0) {
    const normalized = normalizeEventDays(event.eventDays);
    return (
      <div className="xs:text-lg text-sm">
        {normalized.map((day, dayIndex) => {
          const dateStr = format(new Date(day.date), 'dd.MM.yyyy', { locale: de });
          if (!day.isMultiSlot) {
            const slot = day.slots[0];
            return (
              <p key={dayIndex} className="m-0">
                {dateStr}
                {slot ? <><br />{`${slot.startTime} - ${slot.endTime} Uhr`}</> : null}
                {dayIndex < normalized.length - 1 && <br />}
              </p>
            );
          }
          return (
            <div key={dayIndex} className="m-0 mb-2">
              <div className="font-semibold">{dateStr}</div>
              <ul className="list-none m-0 pl-3">
                {day.slots.map((slot, slotIndex) => (
                  <li key={slotIndex} className="m-0">
                    {`${slot.startTime} - ${slot.endTime} Uhr`}
                    {slot.label ? ` · ${slot.label}` : ''}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    );
  }
```

- [ ] **Step 2: Add the import**

At the top of the file, add to the imports:

```ts
import { normalizeEventDays } from '@/lib/events/eventDays';
```

- [ ] **Step 3: Remove dead code**

The `findDateRanges` helper at the top of the file (lines 6-31) is no longer used. Delete it. Also delete the unused `isEqual`, `addDays`, and `isSameDay` imports from `date-fns` (keep `format`, `parseISO`, etc. that are still used).

If `isSameDay` is still used by `renderLegacyEvent` further down the file, keep that import : only delete what becomes unused.

- [ ] **Step 4: Type-check**

Run: `npx tsc --noEmit 2>&1 | grep "RenderDate" | head`
Expected: zero errors specific to this file.

- [ ] **Step 5: Manual verify**

With dev server running, open the homepage. Confirm:
- Existing events with one slot per day still display as before (date + time on a new line).
- The eventStart/eventEnd legacy fallback still works (test by checking any old event that uses it).

- [ ] **Step 6: Commit**

```bash
git add src/app/_components/Homepage_Components/RenderDate.tsx
git commit -m "feat(events): RenderDate nests slots under date for multi-slot days"
```

---

## Task 6: Update newsletter-template.tsx

**Files:**
- Modify: `src/app/_components/email_templates/newsletter-template.tsx`

- [ ] **Step 1: Update the prop type**

In `src/app/_components/email_templates/newsletter-template.tsx`, locate the `NewsletterTemplateProps` interface and replace the `eventDays` field type:

```ts
  eventDays?: Array<{
    date: string;
    slots: Array<{
      startTime: string;
      endTime: string;
      label?: string;
    }>;
  }>;
```

- [ ] **Step 2: Add the import**

Near the top of the file, add:

```ts
import { normalizeEventDays } from '@/lib/events/eventDays';
```

- [ ] **Step 3: Replace the formatEventDays implementation**

Replace the existing `formatEventDays` function with a structured renderer that returns JSX (since email needs HTML structure, not a single multi-line string):

```ts
  const renderEventDays = () => {
    const normalized = normalizeEventDays(eventDays);
    if (normalized.length === 0) return null;

    return normalized.map((day, dayIndex) => {
      const dateStr = new Date(day.date).toLocaleDateString('de-DE', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });

      if (!day.isMultiSlot) {
        const slot = day.slots[0];
        const timeStr = slot ? `${slot.startTime} - ${slot.endTime}` : '';
        return (
          <Text key={dayIndex} style={eventDates}>
            {dateStr}{timeStr ? `, ${timeStr}` : ''}
          </Text>
        );
      }

      return (
        <Section key={dayIndex} style={{ marginBottom: '8px' }}>
          <Text style={{ ...eventDates, fontWeight: 'bold', margin: '0 0 4px 0' }}>
            {dateStr}:
          </Text>
          {day.slots.map((slot, slotIndex) => (
            <Text key={slotIndex} style={{ ...eventDates, margin: '0 0 0 16px' }}>
              {slot.startTime} - {slot.endTime}{slot.label ? `  ${slot.label}` : ''}
            </Text>
          ))}
        </Section>
      );
    });
  };
```

- [ ] **Step 4: Replace the eventDays render block**

Find the JSX block that currently renders the event dates (looking for `{type === 'event' && eventDays && eventDays.length > 0 && (`). Replace its inner content (currently a `<Text>` with `formatEventDays()`) with:

```tsx
            {type === 'event' && eventDays && eventDays.length > 0 && (
              <Section style={eventSection}>
                <Heading style={eventSectionTitle}>Termine:</Heading>
                {renderEventDays()}
              </Section>
            )}
```

- [ ] **Step 5: Type-check**

Run: `npx tsc --noEmit 2>&1 | grep "newsletter-template" | head`
Expected: zero errors.

- [ ] **Step 6: Preview the email**

Run `npm run email:dev` (separate terminal, port 3001). Open in a browser. Pick the newsletter template. Confirm both single-slot and multi-slot days render correctly. (You may need to update the preview fixture in `emails/` if there is one : search for `eventDays` under `emails/` and update.)

If no preview fixture exists, skip the visual preview and rely on the live test in the smoke-test phase.

- [ ] **Step 7: Commit**

```bash
git add src/app/_components/email_templates/newsletter-template.tsx
git commit -m "feat(newsletter): render multi-slot days as nested labeled list"
```

---

## Task 7: Update newsletter API route GROQ projections

**Files:**
- Modify: `src/app/api/newsletter/test/route.ts`
- Modify: `src/app/api/newsletter/send-now/route.ts`

- [ ] **Step 1: Update test route GROQ**

Open `src/app/api/newsletter/test/route.ts`. Find the `DOC_QUERY` constant. Replace:

```
eventDays[]{ date, startTime, endTime, description },
```

With:

```
eventDays[]{ date, slots[]{ startTime, endTime, label } },
```

- [ ] **Step 2: Update send-now route GROQ**

Open `src/app/api/newsletter/send-now/route.ts`. Find the `DOC_QUERY` constant. Make the same replacement as Step 1.

- [ ] **Step 3: Type-check**

Run: `npx tsc --noEmit 2>&1 | grep "newsletter" | head`
Expected: zero errors.

- [ ] **Step 4: Commit**

```bash
git add src/app/api/newsletter/test/route.ts src/app/api/newsletter/send-now/route.ts
git commit -m "feat(newsletter): GROQ projections fetch slots[] instead of flat fields"
```

---

## Task 8: Update content hash for slots

**Files:**
- Modify: `src/lib/newsletter/contentHash.ts`
- Modify: `src/lib/newsletter/contentHash.test.ts`

- [ ] **Step 1: Update test fixtures**

In `src/lib/newsletter/contentHash.test.ts`, find the `extractHashableFields` test for customevent. Replace the `eventDays` fixture to use the new shape:

```ts
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
```

Also add a new test below it:

```ts
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
```

- [ ] **Step 2: Run tests to confirm they fail**

Run: `npm test -- contentHash`
Expected: 2 failures in the customevent tests (because the implementation still returns the flat `startTime`/`endTime` shape).

- [ ] **Step 3: Update the implementation**

In `src/lib/newsletter/contentHash.ts`, update the `CustomEventDoc` interface:

```ts
interface CustomEventDoc {
  _type: 'customevent';
  eventTitle?: string;
  excerpt?: string;
  eventImage?: { asset?: { _ref?: string } };
  slug?: { current?: string } | string;
  eventDays?: Array<{
    date?: string;
    slots?: Array<{ startTime?: string; endTime?: string; label?: string }>;
  }>;
}
```

Update the `HashableFields` interface:

```ts
export interface HashableFields {
  type: 'customevent' | 'post';
  title?: string;
  excerpt?: string;
  imageRef?: string;
  slug?: string;
  eventDays?: Array<{
    date?: string;
    slots?: Array<{ startTime?: string; endTime?: string; label?: string }>;
  }>;
}
```

Update the customevent branch of `extractHashableFields`:

```ts
  if (doc._type === 'customevent') {
    return {
      type: 'customevent',
      title: doc.eventTitle,
      excerpt: doc.excerpt,
      imageRef: doc.eventImage?.asset?._ref,
      slug: getSlug(doc.slug),
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
```

- [ ] **Step 4: Run tests to confirm they pass**

Run: `npm test -- contentHash`
Expected: All tests pass (the original 5 plus the new multi-slot test = 6).

- [ ] **Step 5: Commit**

```bash
git add src/lib/newsletter/contentHash.ts src/lib/newsletter/contentHash.test.ts
git commit -m "feat(newsletter): contentHash includes slots[] for accurate gating"
```

---

## Task 9: Final integration

- [ ] **Step 1: Full test run**

Run: `npm test`
Expected: all test files pass.

- [ ] **Step 2: Full type-check**

Run: `rm -rf .next && npx tsc --noEmit 2>&1 | grep -v "node_modules\|Logo\|LogoCloud\|StudioIcon\|.next/types" | head -20`

Expected: zero output (the asset-import errors that exist on main get filtered).

If errors remain, fix in place and commit.

- [ ] **Step 3: Lint**

Run: `npm run lint 2>&1 | tail -20; echo exit:$?`
Expected: exit 0. Warnings about workspace root and plugin conflict are fine (cosmetic).

- [ ] **Step 4: End-to-end smoke test**

With `npm run dev` running and an event in the dev dataset already migrated:

1. Open `http://localhost:3000/admin`. Open an event.
2. Confirm the eventDays form shows the nested accordion (date + slots inside).
3. Add a second slot to one day. Confirm the label-required validation message appears on both slots until you fill them.
4. Save the document.
5. Open the public site for that event. Confirm:
   - Single-slot days render as one line.
   - The multi-slot day renders as a date heading with indented labeled slots.
6. From Studio, send a test newsletter to your own email. Confirm the email shows the same nested layout.
7. (Optional) Click the manual send button to send the broadcast. Confirm the live newsletter renders correctly.

- [ ] **Step 5: Push to main**

Per project convention (memory: feedback_workflow_no_pr), no PR. Push directly:

```bash
git push origin main
```

- [ ] **Step 6: Production migration reminder**

Tell the user:

> Before subscribers get a newsletter from a multi-slot event, run the migration against production:
>
> ```
> infisical run --env=prod -- npx tsx scripts/migrate-event-days-to-slots.ts --dry-run
> infisical run --env=prod -- npx tsx scripts/migrate-event-days-to-slots.ts
> ```
>
> This rewrites the `customevent` documents in the production Sanity dataset to the new shape. Vercel deploys can stay live during the migration; both old and new code paths will fail gracefully if a doc has the wrong shape, but the time gap should be small.

---

## Self-review checklist (for the implementing engineer)

Before declaring done:

1. `normalizeEventDays` is the single source of truth for slot sorting and `isMultiSlot` detection. No consumer reimplements that logic.
2. The schema's label-required validation correctly fires only when the day has more than one slot.
3. The `showUntilDate` initialValue uses the latest slot's endTime, not just end-of-day.
4. Existing single-slot events render unchanged on the public site (no visual surprise on deploy).
5. Migration script ran cleanly on dev dataset; production run is documented but NOT done in this plan.
6. Newsletter test send produces a correctly-formatted email for both single-slot and multi-slot events.
7. Vitest tests pass: 6 in `contentHash.test.ts` + 6 in `eventDays.test.ts`.

## Out of scope (explicit reminders)

- Calendar / iCal export per slot
- Per-slot images, descriptions, or rich text (only the label)
- Recurring slot templates
- Slot-level RSVP, capacity, or pricing
- Auto-deriving `customOverlayText` from slots (those remain manual)
