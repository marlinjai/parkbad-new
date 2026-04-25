---
type: plan
status: draft
title: Newsletter & Contact Admin Improvements
date: 2026-04-25
summary: Replace auto-on-publish newsletter with explicit manual send, add visible send-status, and persist contact form submissions as a Sanity inbox with reply-from-Studio.
tags: [sanity, newsletter, resend, admin]
projects: [parkbad-new]
---

# Newsletter & Contact Admin Improvements

## Goal

Make newsletter sending an explicit, observable action instead of an opaque side effect of publishing, and give the client a single place inside Sanity Studio to read and answer contact form messages.

The work is grouped into three independent workstreams (A, B, C) that can be implemented in parallel.

## Context

Today the system has two pain points:

1. **Newsletter sending is invisible.** A `sendNewsletter` toggle on the document, when on, causes the publish webhook to fire a Resend broadcast. There is no visible record on the document of whether a newsletter went out, when, or to how many people. When the recent "Saisonöffnung mit den Nasty Habbits" event was published, no newsletter arrived, and there is no way to tell from the Studio why (toggle was off, webhook signature mismatch, dedup hit, BASE_URL wrong, etc.).
2. **Contact form submissions live only in inboxes.** The form sends two emails (team notification, customer auto-reply) and stores nothing. The client has to switch between Studio, their email client, and possibly multiple folders to track who said what.

Existing relevant files:

- `src/app/api/newsletter/route.ts`: signup endpoint
- `src/app/api/newsletter/send/route.ts`: broadcast send (called by webhook)
- `src/app/api/newsletter/test/route.ts`: test send to one address
- `src/app/api/newsletter/webhook/route.ts`: Sanity webhook, currently triggers auto-send
- `src/app/api/send/route.ts`: contact form endpoint
- `src/sanity/schemas/customevent.ts`, `src/sanity/schemas/post.ts`: schemas with `sendNewsletter` and `newsletterTest` fields
- `src/app/_components/Sanity_Components/NewsletterTestButton.tsx`: existing test button
- `src/sanity/desk/structure.ts`: Studio structure (currently auto-lists doc types)

## Workstream A: Newsletter status & decoupled sending

### Schema changes

Both `customevent` and `post` get a new field `newsletterStatus`:

```ts
defineField({
  name: "newsletterStatus",
  title: "Newsletter Status",
  type: "object",
  readOnly: true,
  fields: [
    { name: "lastSentAt", type: "datetime" },
    { name: "lastSentTrigger", type: "string", options: { list: ["manual", "test"] } },
    { name: "lastSentBroadcastId", type: "string" },
    { name: "lastSentRecipientCount", type: "number" },
    { name: "lastTestSentAt", type: "datetime" },
    { name: "lastTestContentHash", type: "string" },
    {
      name: "sendHistory",
      type: "array",
      of: [{ type: "object", fields: [
        { name: "sentAt", type: "datetime" },
        { name: "trigger", type: "string" },
        { name: "broadcastId", type: "string" },
        { name: "recipientCount", type: "number" },
      ]}],
    },
  ],
  components: { input: NewsletterStatusPanel },
})
```

The `sendHistory` array is capped at 20 entries (oldest dropped on write).

### Schema removals

- `sendNewsletter` boolean field on both schemas. UI block disappears.
- `newsletterTest` field stays (it just hosts the existing test button), but the description text is updated to reference the new "send-now" flow.

### Webhook behavior

`src/app/api/newsletter/webhook/route.ts`: remove the entire branch that calls `/api/newsletter/send`. The webhook keeps its current responsibility for triggering page revalidation only (if it does that today). Document fetch, dedup cache, and `sendNewsletter` check are removed. If the webhook was *only* used for newsletter sending and not revalidation, the route file is deleted entirely and the webhook is removed from Sanity manage.

Verification step during implementation: read the webhook route end-to-end, confirm what else (if anything) it does. Adjust the removal scope accordingly.

### Status panel component

New file `src/app/_components/Sanity_Components/NewsletterStatusPanel.tsx`. Reads from `newsletterStatus` field value. States:

- **Never sent**: shows "Newsletter noch nicht versendet" in muted gray.
- **Sent**: shows "Versendet am {DD.MM.YYYY HH:MM} an {N} Abonnenten" with trigger label ("manuell"). Below: collapsible "Verlauf anzeigen" expanding `sendHistory`.

Test info (`lastTestSentAt`) is shown as a small line below: "Letzter Test: {DD.MM.YYYY HH:MM}".

### Migration

Existing documents have `sendNewsletter: true | false | undefined` and no `newsletterStatus`. No data migration required because:

- Removing the field from schema does not delete data from existing docs (Sanity ignores unknown fields).
- `newsletterStatus` simply starts empty on every document until the next send happens.

A one-time cleanup script to strip the orphaned `sendNewsletter` field from all docs is optional. Not blocking.

## Workstream B: Manual send-now button

### Component

New file `src/app/_components/Sanity_Components/NewsletterSendButton.tsx`. Rendered on the `newsletterTest` field area together with (or replacing the host of) the test button. Cleanest implementation: a single combined component `NewsletterControls` that renders both the test input and the send button, since they share the document state and benefit from being adjacent.

### Content hash

Computed client-side from the fields that materially affect the email body:

- For `customevent`: `eventTitle`, `excerpt`, `eventImage._ref`, `eventDays` (date + times for each)
- For `post`: `title`, `excerpt`, `coverImage._ref`, `slug.current`

Algorithm: stable JSON serialization of those fields, then SHA-256, hex string. Implemented as `lib/newsletter/contentHash.ts` (shared between client component and `/api/newsletter/test` so both produce identical hashes).

### Button states

| State | Trigger | UI |
|-------|---------|----|
| Locked | `lastTestSentAt` is null | Disabled. Label: "Bitte erst eine Test-E-Mail senden". |
| Stale test | `lastTestSentAt` set, current hash mismatches `lastTestContentHash` | Disabled. Label: "Inhalt seit Test geändert, bitte erneut testen". |
| Armed | Hash matches | Enabled. Label: "An ca. {N} Abonnenten senden". |
| Already sent | `lastSentAt` set and matches current hash | Enabled but secondary tone. Label: "Bereits versendet am {…}, erneut senden?". Click reveals confirm modal as below. |

Recipient count `N`: fetched on mount via `resend.contacts.list` server-side helper exposed at `/api/newsletter/recipient-count`. Cached in component state for the session.

### Confirm modal

Triggered by armed-state click. Single modal:

> Newsletter wird an {N} Abonnenten gesendet. Vorgang ist nicht widerrufbar.

Buttons: `Abbrechen` (secondary), `Jetzt senden` (primary, `tone="critical"` styling).

### Backend

New route `src/app/api/newsletter/send-now/route.ts`. Inputs: `documentId`, `documentType`, `expectedHash`. Steps:

1. Auth: the Studio custom component obtains the current user's Sanity auth token via the `useClient` hook (Studio's authenticated client carries the token). The component sends it as `Authorization: Bearer <sanityToken>`. The API route validates it by constructing a `@sanity/client` instance with that token and calling `client.users.getById('me')`: if the call succeeds, the user is authenticated against the dataset. Reject otherwise. Origin header is also checked as a defense-in-depth measure.
2. Fetch document from Sanity using the existing `sanityFetch` helper.
3. Recompute content hash server-side, compare to `expectedHash`. Reject if mismatch (race condition guard).
4. Build broadcast using shared `lib/newsletter/sendBroadcast.ts` (extracted from the existing `/api/newsletter/send` logic).
5. On success, patch the document via Sanity write client: set `newsletterStatus.lastSentAt`, `lastSentTrigger: "manual"`, `lastSentBroadcastId`, `lastSentRecipientCount`, append to `sendHistory`.
6. Return `{ success: true, broadcastId, recipientCount }`.

`/api/newsletter/test/route.ts` is updated to also patch `newsletterStatus.lastTestSentAt` and `lastTestContentHash` after a successful send. This is the only schema-write change to the test endpoint, otherwise it stays as-is.

### Shared helper

New file `src/lib/newsletter/sendBroadcast.ts`. Pure function: given `{ type, title, excerpt, slug, imageUrl, eventDays }` returns `{ broadcastId, recipientCount }` or throws. Both `/api/newsletter/send-now` and the existing `/api/newsletter/send` (kept as legacy/internal call) use it. Eliminates the current duplication between `send` and `test` route bodies.

### Removed routes

After migration: `/api/newsletter/send/route.ts` is deleted (was only called by the webhook, which no longer calls it). If easier to keep for safety, mark the file with a one-line `throw new Error("deprecated")` at the top of POST. Decision deferred to implementation.

## Workstream C: Contact submissions inbox

### Schema

New file `src/sanity/schemas/contactSubmission.ts`:

```ts
defineType({
  name: "contactSubmission",
  title: "Kontakt-Anfrage",
  type: "document",
  fields: [
    { name: "firstName", type: "string", readOnly: true },
    { name: "lastName", type: "string", readOnly: true },
    { name: "email", type: "string", readOnly: true },
    { name: "phone", type: "string", readOnly: true },
    { name: "message", type: "text", readOnly: true },
    { name: "receivedAt", type: "datetime", readOnly: true },
    { name: "autoReplyEmailId", type: "string", readOnly: true, hidden: true },
    { name: "originalMessageId", type: "string", readOnly: true, hidden: true },
    {
      name: "status",
      type: "string",
      options: { list: ["offen", "inBearbeitung", "erledigt"] },
      initialValue: "offen",
    },
    { name: "internalNotes", type: "text" },
    {
      name: "replies",
      type: "array",
      readOnly: true,
      of: [{ type: "object", fields: [
        { name: "sentAt", type: "datetime" },
        { name: "sentBy", type: "string" },
        { name: "body", type: "text" },
        { name: "resendEmailId", type: "string" },
      ]}],
    },
    {
      name: "replyComposer",
      type: "string",
      components: { input: ContactReplyPanel },
    },
  ],
  preview: {
    select: { firstName: "firstName", lastName: "lastName", message: "message", status: "status" },
    prepare: ({ firstName, lastName, message, status }) => ({
      title: `${firstName} ${lastName}`,
      subtitle: `[${status}] ${message?.slice(0, 60) ?? ""}`,
    }),
  },
  orderings: [
    { name: "receivedAtDesc", title: "Neueste zuerst", by: [{ field: "receivedAt", direction: "desc" }] },
  ],
})
```

The `replyComposer` field is a UI-only host for the custom component, similar to how `newsletterTest` works today.

### Capture in contact form route

`src/app/api/send/route.ts`: after the team-notification email succeeds, generate a Message-ID for threading (`<{uuid}@parkbad-gt.de>`), include it in the team-notification email's headers, then write a `contactSubmission` doc via the Sanity write client. Wrap the write in try/catch so a Sanity outage never blocks the contact form response.

### Studio structure

`src/sanity/desk/structure.ts`: replace the auto-list with an explicit structure that puts a "Kontakt-Anfragen" node at the top, with sub-views for `Offen`, `In Bearbeitung`, `Erledigt`, and `Alle` (filtered by `status`). All other document types remain auto-listed below.

### Reply panel component

New file `src/app/_components/Sanity_Components/ContactReplyPanel.tsx`. Layout:

- Original message panel (read-only, formatted)
- Replies list (oldest first), small cards: `{sentAt} - {sentBy}` then body
- Reply composer: textarea + "Senden als verwaltung@parkbad-gt.de" button
- Hint text below: "Antworten Sie hier, damit das Gespräch dokumentiert ist."

### Backend reply route

New route `src/app/api/contact/reply/route.ts`. Inputs: `submissionId`, `body`. Steps:

1. Auth: same approach as send-now (Sanity user token from Studio, validated server-side via `client.users.getById('me')`).
2. Fetch submission doc from Sanity to get `email`, `originalMessageId`, `firstName`.
3. Send via Resend from `verwaltung@parkbad-gt.de` to `{email}`, with headers `In-Reply-To: <{originalMessageId}>` and `References: <{originalMessageId}>` so the customer's mail client threads the reply into the original conversation.
4. Subject: `Re: Ihre Anfrage an Parkbad Gütersloh`.
5. Patch the submission doc: append `{sentAt: now, sentBy: <Sanity user name>, body, resendEmailId}` to `replies` and set `status = "inBearbeitung"` if it was `offen`.

### Privacy note

`contactSubmission` docs contain PII. Storage and access control follow Sanity's existing dataset permissions. No separate retention policy unless explicitly added later.

## Open questions

None at design time. Implementation may surface secondary decisions (exact wording, modal styling), which are scoped to the implementation plan.

## Out of scope

- Inbound email parsing (capturing customer replies sent via email client back into Sanity).
- Migration script to strip the legacy `sendNewsletter` field from existing docs.
- Per-user notification preferences or assignment (any authenticated Studio user can reply on behalf of the team; `sentBy` records the user's name from `client.users.getById('me')`, but no inbox-routing or per-user assignment is implemented).
- Recipient list segmentation (always sends to the full Resend audience).
- Rate limiting on `/api/contact/reply` and `/api/newsletter/send-now`.

## Success criteria

1. Publishing an event no longer sends a newsletter.
2. The Studio form for an event or post shows clearly whether a newsletter has been sent, when, and to how many people.
3. The "send-now" button is impossible to click without first sending a successful test of the same content.
4. Every contact form submission appears as a Sanity doc within 5 seconds of being submitted.
5. The client can read, mark status, take internal notes on, and reply to a submission entirely inside Studio.
6. A reply sent from Studio arrives in the customer's mail client and threads correctly under the original auto-reply conversation.

## File-level change summary

**New files:**

- `src/lib/newsletter/contentHash.ts`
- `src/lib/newsletter/sendBroadcast.ts`
- `src/app/_components/Sanity_Components/NewsletterStatusPanel.tsx`
- `src/app/_components/Sanity_Components/NewsletterSendButton.tsx` (or combined `NewsletterControls.tsx`)
- `src/app/_components/Sanity_Components/ContactReplyPanel.tsx`
- `src/app/api/newsletter/send-now/route.ts`
- `src/app/api/newsletter/recipient-count/route.ts`
- `src/app/api/contact/reply/route.ts`
- `src/sanity/schemas/contactSubmission.ts`

**Modified:**

- `src/sanity/schemas/customevent.ts` (remove `sendNewsletter`, add `newsletterStatus`)
- `src/sanity/schemas/post.ts` (same)
- `src/sanity/schemas/index.ts` (register `contactSubmission`)
- `src/sanity/desk/structure.ts` (add Kontakt-Anfragen node)
- `src/app/api/newsletter/test/route.ts` (patch `lastTestSentAt`, `lastTestContentHash` on success)
- `src/app/api/newsletter/webhook/route.ts` (strip auto-send branch, possibly delete)
- `src/app/api/send/route.ts` (persist submission to Sanity)

**Deleted (likely):**

- `src/app/api/newsletter/send/route.ts` (after extracting logic to shared helper)
