---
type: plan
status: draft
title: Multi-Slot Event Days
date: 2026-04-25
summary: Allow a single event day to contain multiple time slots with labels (e.g. "Saisoneröffnung 12-22" plus "Nasty Habbits live 19-22"), rendered stacked on the card, detail page, and newsletter.
tags: [sanity, events, schema, ux]
projects: [parkbad-new]
---

# Multi-Slot Event Days

## Goal

Let an event day express more than one time slot, each with its own label, so a "Saisoneröffnung" that spans 12:00 to 22:00 with a band playing 19:00 to 22:00 can be authored as one event with structured data, and that structure flows automatically into the event card, the detail page, and the newsletter email.

## Context

Today, `customevent.eventDays` is a flat array of `{date, startTime, endTime, description?}`. One day can hold one time range. To express multiple things on the same day, the editor either splits into two events (loses the "one event" feel) or folds the second time into the optional description (works visually but the second time isn't structured data, so the newsletter and card don't show it consistently).

Existing escape hatches `customOverlayText` and `customOverlaySubtext` cover the slider card overlay only. They do not propagate to the newsletter, the detail page time list, or any future structured consumer (iCal, search, etc.).

Existing files affected (~10):

- Schema: `src/sanity/schemas/customevent.ts`
- Renderers: `src/app/_components/Posts&Events_Components/Archive.tsx`, `src/app/_components/Swiper&GaleryComponents/PostCardsSlider.tsx`, `src/app/_components/Homepage_Components/RenderDate.tsx`, `src/app/_components/Posts&Events_Components/Post.tsx`
- Newsletter: `src/app/_components/email_templates/newsletter-template.tsx`, `src/app/api/newsletter/test/route.ts`, `src/app/api/newsletter/send-now/route.ts`
- Newsletter content hash: `src/lib/newsletter/contentHash.ts` (and its test)
- Studio Send button: `src/app/_components/Sanity_Components/NewsletterSendButton.tsx` (passes eventDays into hash)
- GROQ queries: `src/sanity/lib/sanity.queries.ts`

## Schema change

`customevent.eventDays[]` rows now nest a required `slots[]` array. Each slot has `startTime`, `endTime`, and a conditionally-required `label`.

```ts
defineField({
  name: 'eventDays',
  title: 'Veranstaltungstage',
  type: 'array',
  validation: rule => rule.required().min(1),
  of: [
    {
      type: 'object',
      fields: [
        defineField({
          name: 'date',
          title: 'Datum',
          type: 'date',
          validation: rule => rule.required(),
        }),
        defineField({
          name: 'slots',
          title: 'Zeitfenster',
          type: 'array',
          validation: rule => rule.required().min(1),
          of: [
            {
              type: 'object',
              fields: [
                defineField({
                  name: 'startTime',
                  title: 'Startzeit',
                  type: 'string',
                  options: { list: HALF_HOUR_LIST },
                  validation: rule => rule.required(),
                }),
                defineField({
                  name: 'endTime',
                  title: 'Endzeit',
                  type: 'string',
                  options: { list: HALF_HOUR_LIST },
                  validation: rule => rule.required(),
                }),
                defineField({
                  name: 'label',
                  title: 'Bezeichnung (Pflicht bei mehreren Zeitfenstern)',
                  type: 'string',
                  validation: rule => rule.custom((label, context) => {
                    const parentDay = context.parent as { slots?: unknown[] } | undefined;
                    const parentSlots = (context.path[2] === 'slots' ? (context.document as any)?.eventDays?.[context.path[1] as number]?.slots : parentDay?.slots) ?? [];
                    if (parentSlots.length > 1 && !label?.trim()) {
                      return 'Bei mehreren Zeitfenstern ist eine Bezeichnung erforderlich.';
                    }
                    return true;
                  }),
                }),
              ],
              preview: {
                select: { startTime: 'startTime', endTime: 'endTime', label: 'label' },
                prepare: ({ startTime, endTime, label }) => ({
                  title: `${startTime} - ${endTime}`,
                  subtitle: label || 'ohne Bezeichnung',
                }),
              },
            },
          ],
        }),
      ],
      preview: {
        select: { date: 'date', slots: 'slots' },
        prepare: ({ date, slots }) => {
          const dateStr = new Date(date).toLocaleDateString('de-DE');
          const slotCount = (slots ?? []).length;
          return {
            title: dateStr,
            subtitle: slotCount === 1
              ? `${slots[0].startTime} - ${slots[0].endTime}${slots[0].label ? ' · ' + slots[0].label : ''}`
              : `${slotCount} Zeitfenster`,
          };
        },
      },
    },
  ],
}),
```

`HALF_HOUR_LIST` is the existing list of 30-minute increments already declared inline in the schema. Extracted to a top-of-file `const` to share between startTime and endTime.

The legacy `description` field on `eventDays` rows is removed. Migration moves its value into the first slot's `label`.

## Migration

One-shot script `scripts/migrate-event-days-to-slots.ts`. Idempotent: skips documents where any `eventDays[i].slots` already exists.

For each `customevent` document where `eventDays[].startTime` is defined (legacy shape):

1. Build the new `eventDays` array by transforming each row:
   ```
   {date, startTime, endTime, description} → {date, slots: [{startTime, endTime, label: description || undefined}]}
   ```
2. Patch the document with the new array, unsetting the orphan top-level `startTime`, `endTime`, `description` fields per row.

Run with `infisical run --env=dev -- npx tsx scripts/migrate-event-days-to-slots.ts` (and again with `--env=prod` against the production dataset). Output prints one line per migrated document plus a summary (migrated / already-new-shape / errors).

## Display logic

A new shared helper `src/lib/events/eventDays.ts`:

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
  return (days ?? []).map(d => {
    const sorted = [...(d.slots ?? [])].sort((a, b) => a.startTime.localeCompare(b.startTime));
    return { date: d.date, slots: sorted, isMultiSlot: sorted.length > 1 };
  });
}
```

Sort within a day is by `startTime` ascending. Stable for ties.

### Single-slot day rendering

Unchanged. One line: `Fr 1. Mai 2026, 15:00 - 20:00`. Editor sees no visual change for events that don't use the new feature.

### Multi-slot day rendering

Date heading on its own line. Each slot on its own indented line below, with label. Example:

```
Fr 1. Mai 2026:
  12:00 - 22:00  Saisoneröffnung
  19:00 - 22:00  Nasty Habbits live
```

Concrete component changes:

- **`PostCardsSlider.tsx` and `Archive.tsx`**: sort and "next date" computation use `normalizeEventDays(...)[0].date` (no behavior change for single-slot days).
- **`RenderDate.tsx`**: renders nested layout when `isMultiSlot`. Single-slot keeps current single-line format.
- **`Post.tsx`** (event detail page): same nested rendering rules as `RenderDate.tsx`.
- **`newsletter-template.tsx`**: both HTML and text alternatives render nested for multi-slot days. HTML uses a small table or padded `<div>` for indent. Text uses two-space indent.

### Newsletter API routes

`test/route.ts` and `send-now/route.ts` already destructure `document.eventDays` and pass it to the template. The query needs to project `slots[]` instead of `startTime/endTime/description`. Otherwise unchanged.

## "Ende der Anzeige auf der Homepage" auto-fill

The schema field `showUntilDate` has an `initialValue` that scans `eventDays` for the last day's date and sets the cutoff to end-of-day. Updated to compute the cutoff from the new shape: find the last `eventDays[i]` (sorted by date), then take the latest `slots[].endTime` within that day. Format as ISO with that exact end time. If no slots are present, fall back to end-of-day at 23:59.

## Content hash

`src/lib/newsletter/contentHash.ts`'s `extractHashableFields` currently flattens eventDays rows to `{date, startTime, endTime}`. Updated to flatten to `{date, slots: [{startTime, endTime, label}]}` so any change to a slot (including label edits) invalidates the test-required gate on the Send button. Existing test in `contentHash.test.ts` updated to assert the new shape.

The shared input on the `NewsletterSendButton` component already passes the full `eventDays` value through `useFormValue(['eventDays'])`, so no component change is needed beyond updating the test fixtures.

## Studio editing UX

Sanity's default rendering for nested arrays handles this acceptably:

- The outer `eventDays` array shows one row per day with the day-level preview (`Fr 1. Mai · 2 Zeitfenster`).
- Click a day to open it. The inner `slots` array shows one row per slot with its preview (`12:00 - 22:00 · Saisoneröffnung`).
- "Add slot" button appears at the bottom of the slots array.
- The label validation message ("Bei mehreren Zeitfenstern ist eine Bezeichnung erforderlich.") appears inline on the second slot when it's missing a label.

No custom input component is required.

## Testing

- **Migration script:** dry-run mode (`--dry-run` flag) prints what would be patched without writing. Run dry-run first, eyeball, then run real.
- **`normalizeEventDays`:** vitest unit tests for empty, single-slot, multi-slot, and unsorted-slot inputs.
- **`extractHashableFields`:** existing test updated for new shape; one new test for multi-slot input.
- **Manual smoke test (after migration):**
  1. Open an existing single-slot event in Studio. Confirm the slot is visible inside the day, layout works, no warnings.
  2. Open the public site. Confirm the event card and detail page render exactly as before.
  3. Add a second slot to one day. Confirm validation requires labels on both slots.
  4. Save and view the detail page. Confirm nested layout.
  5. Send a newsletter test. Confirm the email shows the nested layout in both HTML and text.

## Out of scope

- Calendar / iCal export per slot
- Per-slot images, descriptions, or rich text (only the label)
- Recurring slot templates
- Slot-level RSVP, capacity, or pricing
- Updating `customOverlayText` / `customOverlaySubtext` to be auto-derived from slots (those remain manual escape hatches)
