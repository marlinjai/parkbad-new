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
import { portableTextToPlainText } from '@/lib/newsletter/plainText';

const resend = new Resend(process.env.RESEND_API_KEY);

interface TestNewsletterRequest {
  documentId: string;
  documentType: 'post' | 'customevent';
  testEmail: string;
}

const DOC_QUERY = `*[_id == $id][0]{
  _type, _id, "slug": slug.current, title, excerpt, date,
  eventContent,
  coverImage{ asset->{_id, url}, crop, hotspot, alt },
  eventTitle,
  eventDays[]{ date, slots[]{ startTime, endTime, label } },
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
    const description = document.excerpt || portableTextToPlainText(document.eventContent);
    const imageUrl = document.coverImage
      ? urlForImage(document.coverImage).url()
      : (document.eventImage ? urlForImage(document.eventImage).url() : undefined);

    const html = await render(React.createElement(NewsletterTemplate, {
      type: newsletterType,
      title, excerpt: description, imageUrl, slug,
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
      text: `[TEST] ${title}\n\n${description}\n\nMehr: ${process.env.NEXT_PUBLIC_BASE_URL}/${slug}`,
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
