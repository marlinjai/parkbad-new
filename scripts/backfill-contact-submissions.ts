// scripts/backfill-contact-submissions.ts
// One-shot: pull historical contact-form team-notification emails from Resend
// and create matching contactSubmission docs in Sanity.
//
// Run with:
//   infisical run --env=dev --projectId=$INFISICAL_PID_PARKBAD -- npx tsx scripts/backfill-contact-submissions.ts
//
// Requires env: RESEND_API_KEY, NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET, SANITY_API_WRITE_TOKEN.

import { createClient } from '@sanity/client';
import { Resend } from 'resend';

const TEAM_INBOX = 'verwaltung@parkbad-gt.de';
const SUBJECT_PREFIX = 'Neue Nachricht von ';
const MAX_PAGES = 50; // safety cap; 50 * 100 = 5000 emails max
const PAGE_SIZE = 100;
const FETCH_DELAY_MS = 100; // ~10 req/s, polite

const resend = new Resend(process.env.RESEND_API_KEY!);
const sanity = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_WRITE_TOKEN!,
  useCdn: false,
});

interface ParsedSubmission {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message: string;
}

function parseTeamNotificationText(text: string): ParsedSubmission | null {
  // The route at src/app/api/send/route.ts builds this text:
  //   `Neue Nachricht von ${firstName} ${lastName} - E-Mail: ${email} - Telefon: ${phone} - Nachricht: ${message}`
  const re = /^Neue Nachricht von (.+?) - E-Mail: (.+?) - Telefon: (.+?) - Nachricht: ([\s\S]+)$/;
  const match = text.match(re);
  if (!match) return null;
  const fullName = match[1].trim();
  const parts = fullName.split(/\s+/);
  const firstName = parts[0] ?? '';
  const lastName = parts.slice(1).join(' ');
  return {
    firstName,
    lastName,
    email: match[2].trim(),
    phone: match[3].trim(),
    message: match[4].trim(),
  };
}

function sleep(ms: number) {
  return new Promise(r => setTimeout(r, ms));
}

async function existingSubmissionFor(email: string, receivedAt: string): Promise<boolean> {
  // Treat "same email within 60s of given timestamp" as a duplicate.
  const t = new Date(receivedAt).getTime();
  const lo = new Date(t - 60_000).toISOString();
  const hi = new Date(t + 60_000).toISOString();
  const result = await sanity.fetch<number>(
    `count(*[_type == "contactSubmission" && email == $email && receivedAt >= $lo && receivedAt <= $hi])`,
    { email, lo, hi }
  );
  return result > 0;
}

async function main() {
  console.log(`Listing emails from Resend (max ${MAX_PAGES} pages of ${PAGE_SIZE})...`);

  const candidates: Array<{ id: string; subject: string; createdAt: string; to: string[] }> = [];
  let after: string | undefined = undefined;
  let pages = 0;

  while (pages < MAX_PAGES) {
    pages += 1;
    const opts: { limit: number; after?: string } = { limit: PAGE_SIZE };
    if (after) opts.after = after;
    const resp = await resend.emails.list(opts);
    if (resp.error || !resp.data) {
      console.error('List error:', resp.error);
      break;
    }
    const list = resp.data.data;
    for (const email of list) {
      const subj = (email as any).subject as string | undefined;
      const to = (email as any).to as string[] | undefined;
      const created = (email as any).created_at as string | undefined;
      if (!subj || !to || !created) continue;
      if (!subj.startsWith(SUBJECT_PREFIX)) continue;
      if (!to.includes(TEAM_INBOX)) continue;
      candidates.push({ id: email.id, subject: subj, createdAt: created, to });
    }
    if (!resp.data.has_more || list.length === 0) break;
    after = list[list.length - 1].id;
    console.log(`  page ${pages}: ${list.length} listed, ${candidates.length} candidates so far`);
  }

  console.log(`\nFound ${candidates.length} team-notification emails matching the contact form pattern.`);
  if (candidates.length === 0) {
    console.log('Nothing to backfill.');
    return;
  }

  let created = 0;
  let skippedDuplicate = 0;
  let skippedUnparseable = 0;
  let errors = 0;

  for (let i = 0; i < candidates.length; i++) {
    const c = candidates[i];
    process.stdout.write(`[${i + 1}/${candidates.length}] ${c.id} (${c.createdAt})... `);

    try {
      const detail = await resend.emails.get(c.id);
      if (detail.error || !detail.data) {
        console.log(`error: ${detail.error?.message ?? 'no data'}`);
        errors += 1;
        continue;
      }
      const text = (detail.data as any).text as string | undefined;
      if (!text) {
        console.log('no text body, skip');
        skippedUnparseable += 1;
        continue;
      }
      const parsed = parseTeamNotificationText(text);
      if (!parsed) {
        console.log('unparseable, skip');
        skippedUnparseable += 1;
        continue;
      }

      if (await existingSubmissionFor(parsed.email, c.createdAt)) {
        console.log('duplicate, skip');
        skippedDuplicate += 1;
        continue;
      }

      await sanity.create({
        _type: 'contactSubmission',
        firstName: parsed.firstName,
        lastName: parsed.lastName,
        email: parsed.email,
        phone: parsed.phone,
        message: parsed.message,
        receivedAt: c.createdAt,
        autoReplyEmailId: null,
        originalMessageId: null,
        status: 'erledigt',
        internalNotes: `Backfilled from Resend on ${new Date().toISOString().slice(0, 10)} (Resend email ID: ${c.id}).`,
        replies: [],
      });
      console.log('created');
      created += 1;
    } catch (err: any) {
      console.log(`error: ${err?.message ?? err}`);
      errors += 1;
    }

    await sleep(FETCH_DELAY_MS);
  }

  console.log('\nSummary:');
  console.log(`  created:           ${created}`);
  console.log(`  skipped duplicate: ${skippedDuplicate}`);
  console.log(`  skipped unparse:   ${skippedUnparseable}`);
  console.log(`  errors:            ${errors}`);
}

main().catch(err => {
  console.error('Fatal:', err);
  process.exit(1);
});
