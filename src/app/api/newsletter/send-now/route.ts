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
  eventDays[]{ date, slots[]{ startTime, endTime, label } },
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
