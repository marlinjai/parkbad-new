// src/app/api/newsletter/webhook/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { parseBody } from 'next-sanity/webhook';
import { sanityFetch } from '../../../../sanity/lib/sanity.fetch';
import { urlForImage } from '../../../../sanity/lib/sanity.image';

interface SanityDocument {
  _type: string;
  title?: string;
  eventTitle?: string;
  excerpt?: string;
  slug?: {
    current: string;
  };
  coverImage?: any;
  eventImage?: any;
  date?: string;
  sendNewsletter?: boolean;
  eventDays?: Array<{
    date: string;
    startTime: string;
    endTime: string;
    description?: string;
  }>;
}

// Simple in-memory cache to prevent duplicate newsletters
// In production, you might want to use Redis or a database
const processedRevisions = new Map<string, number>();

// Clean up old entries every hour to prevent memory leaks
setInterval(() => {
  const oneHourAgo = Date.now() - (60 * 60 * 1000);
  for (const [key, timestamp] of processedRevisions.entries()) {
    if (timestamp < oneHourAgo) {
      processedRevisions.delete(key);
    }
  }
}, 60 * 60 * 1000);

export async function POST(request: NextRequest) {
  try {
    console.log("📧 Newsletter webhook received at:", new Date().toISOString());
    
    const revalidateSecret = process.env.SANITY_REVALIDATE_SECRET;
    console.log("🔑 Using secret:", revalidateSecret ? "SECRET_SET" : "SECRET_MISSING");

    // Use Sanity's parseBody for proper webhook signature validation
    const { body, isValidSignature } = await parseBody<{
      _type: string;
      _id: string;
      _rev: string;
    }>(request, revalidateSecret);
    
    console.log("📦 Newsletter webhook body:", JSON.stringify(body, null, 2));
    console.log("✅ Signature valid:", isValidSignature);
    
    if (!isValidSignature) {
      const message = "Invalid signature";
      console.error("❌ Invalid webhook signature");
      return new Response(message, { status: 401 });
    }

    if (!body?._type || !body?._id || !body?._rev) {
      console.error("❌ Missing required fields in webhook body");
      return new Response("Bad Request", { status: 400 });
    }

    // Check for duplicate processing using document ID + revision
    const revisionKey = `${body._id}:${body._rev}`;
    if (processedRevisions.has(revisionKey)) {
      console.log(`🔄 Skipping duplicate newsletter for revision: ${revisionKey}`);
      return NextResponse.json({ 
        message: 'Newsletter already processed for this revision',
        skipped: true,
        revisionKey 
      });
    }

    // Mark this revision as processed
    processedRevisions.set(revisionKey, Date.now());
    console.log(`✅ Processing new revision: ${revisionKey}`);

    // Only process posts and events
    if (body._type !== 'post' && body._type !== 'customevent') {
      console.log(`ℹ️ Skipping newsletter for type: ${body._type}`);
      return NextResponse.json({ 
        message: `Not a post or event (${body._type}), skipping newsletter` 
      });
    }

    console.log(`📝 Processing ${body._type} document: ${body._id}`);

    // Fetch the full document from Sanity
    const documentQuery = `*[_id == $id][0]{
      _type,
      _id,
      _rev,
      "slug": slug.current,
      title,
      excerpt,
      date,
      sendNewsletter,
      coverImage{
        asset->{_id, url},
        crop,
        hotspot,
        alt
      },
      eventTitle,
      eventDays[]{
        date,
        startTime,
        endTime,
        description
      },
      eventImage{
        asset->{_id, url},
        crop,
        hotspot,
        alt
      }
    }`;

    const document: SanityDocument = await sanityFetch({
      query: documentQuery,
      params: { id: body._id }
    });

    if (!document || !document.slug) {
      console.error("❌ Document not found or missing slug:", body._id);
      return NextResponse.json(
        { error: 'Document not found or missing slug' },
        { status: 404 }
      );
    }

    console.log(`📄 Document found: ${document.title || document.eventTitle}`);
    console.log(`📧 Send newsletter flag: ${document.sendNewsletter}`);

    // Check if newsletter should be sent
    if (!document.sendNewsletter) {
      console.log(`ℹ️ Newsletter sending disabled for this document. Skipping newsletter.`);
      return NextResponse.json({ 
        message: 'Newsletter sending disabled for this document',
        skipped: true,
        documentId: body._id,
        documentType: body._type
      });
    }

    // Prepare newsletter data
    const newsletterType = document._type === 'post' ? 'post' : 'event';
    const newsletterTitle = document.title || document.eventTitle || 'Neue Ankündigung';
    const newsletterExcerpt = document.excerpt;
    const newsletterImageUrl = document.coverImage ? urlForImage(document.coverImage).url() : (document.eventImage ? urlForImage(document.eventImage).url() : undefined);
    const newsletterSlug = document.slug.current? document.slug.current : document.slug;
    const newsletterEventDays = document.eventDays;

    console.log(`📬 Sending newsletter for ${newsletterType}: ${newsletterTitle}`);

    // Call the internal API to send the newsletter
    const sendResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/newsletter/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.SANITY_REVALIDATE_SECRET}` // Use secret for internal API call
      },
      body: JSON.stringify({
        type: newsletterType,
        title: newsletterTitle,
        excerpt: newsletterExcerpt,
        imageUrl: newsletterImageUrl,
        slug: newsletterSlug,
        eventDays: newsletterEventDays,
        secret: process.env.SANITY_REVALIDATE_SECRET // Pass secret for internal validation
      }),
    });

    if (!sendResponse.ok) {
      const errorData = await sendResponse.json();
      console.error('❌ Failed to send newsletter from webhook:', errorData);
      return NextResponse.json(
        { error: 'Failed to send newsletter', details: errorData },
        { status: 500 }
      );
    }

    const sendResult = await sendResponse.json();
    console.log('✅ Newsletter webhook processed successfully:', sendResult);

    const response = {
      success: true, 
      message: 'Newsletter triggered successfully', 
      documentId: body._id,
      documentType: body._type,
      sendResult,
      now: Date.now()
    };

    console.log("✅ Newsletter webhook successful:", response);
    return NextResponse.json(response);

  } catch (error) {
    console.error('❌ Newsletter webhook processing error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
