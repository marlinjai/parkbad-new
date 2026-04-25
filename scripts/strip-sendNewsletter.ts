// scripts/strip-sendNewsletter.ts
// One-shot: remove the orphaned `sendNewsletter` field from all customevent and post docs.
// Run with: npx tsx scripts/strip-sendNewsletter.ts
// Requires: SANITY_API_WRITE_TOKEN, NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET in env.

import { createClient } from '@sanity/client';

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_WRITE_TOKEN!,
  useCdn: false,
});

async function main() {
  const docs = await client.fetch<Array<{ _id: string; _type: string; sendNewsletter?: boolean }>>(
    `*[(_type == "customevent" || _type == "post") && defined(sendNewsletter)]{ _id, _type, sendNewsletter }`
  );

  console.log(`Found ${docs.length} document(s) with orphaned sendNewsletter field.`);

  if (docs.length === 0) {
    console.log('Nothing to clean.');
    return;
  }

  for (const doc of docs) {
    console.log(`  - ${doc._type} ${doc._id} (was: ${doc.sendNewsletter})`);
  }

  console.log('\nUnsetting sendNewsletter on all matched docs...');

  const tx = client.transaction();
  for (const doc of docs) {
    tx.patch(doc._id, p => p.unset(['sendNewsletter']));
  }
  const result = await tx.commit();

  console.log(`Done. ${result.results?.length ?? 0} docs updated.`);
}

main().catch(err => {
  console.error('Failed:', err);
  process.exit(1);
});
