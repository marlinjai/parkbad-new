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
