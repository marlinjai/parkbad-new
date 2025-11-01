// src/app/api/newsletter/test/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { NewsletterTemplate } from '../../../_components/email_templates/newsletter-template';
import { render } from '@react-email/render';
import React from 'react';
import { sanityFetch } from '../../../../sanity/lib/sanity.fetch';
import { urlForImage } from '../../../../sanity/lib/sanity.image';

const resend = new Resend(process.env.RESEND_API_KEY);

interface TestNewsletterRequest {
  documentId: string;
  documentType: 'post' | 'customevent';
  testEmail: string;
}

interface SanityDocument {
  _type: string;
  _id: string;
  slug?: string | { current?: string };
  title?: string;
  eventTitle?: string;
  excerpt?: string;
  coverImage?: any;
  eventImage?: any;
  eventDays?: Array<{
    date: string;
    startTime: string;
    endTime: string;
    description?: string;
  }>;
}

export async function POST(request: NextRequest) {
  try {
    const body: TestNewsletterRequest = await request.json();
    const { documentId, documentType, testEmail } = body;

    if (!documentId || !documentType || !testEmail) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (!testEmail.includes('@')) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Only allow post and customevent
    if (documentType !== 'post' && documentType !== 'customevent') {
      return NextResponse.json(
        { error: 'Invalid document type' },
        { status: 400 }
      );
    }

    console.log(`📧 Sending test newsletter for ${documentType}: ${documentId} to ${testEmail}`);

    // Fetch the document from Sanity
    const documentQuery = `*[_id == $id][0]{
      _type,
      _id,
      "slug": slug.current,
      title,
      excerpt,
      date,
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

    const document = await sanityFetch<SanityDocument>({
      query: documentQuery,
      params: { id: documentId }
    });

    if (!document || !document.slug) {
      return NextResponse.json(
        { error: 'Document not found or missing slug' },
        { status: 404 }
      );
    }

    // Prepare newsletter data
    const newsletterType = document._type === 'post' ? 'post' : 'event';
    const newsletterTitle = document.title || document.eventTitle || 'Test Newsletter';
    const newsletterExcerpt = document.excerpt;
    const newsletterImageUrl = document.coverImage 
      ? urlForImage(document.coverImage).url() 
      : (document.eventImage ? urlForImage(document.eventImage).url() : undefined);
    const newsletterSlug = typeof document.slug === 'string' ? document.slug : document.slug?.current || '';
    
    if (!newsletterSlug) {
      return NextResponse.json(
        { error: 'Document slug is missing' },
        { status: 404 }
      );
    }
    
    const newsletterEventDays = document.eventDays;

    // Create email subject with TEST prefix
    const subject = newsletterType === 'post' 
      ? `[TEST] Parkbad Gütersloh: ${newsletterTitle}`
      : `[TEST] Neue Veranstaltung im Parkbad Gütersloh: ${newsletterTitle}`;

    // Render the email template using React Email
    const emailHtml = await render(
      React.createElement(NewsletterTemplate, {
        type: newsletterType,
        title: newsletterTitle,
        excerpt: newsletterExcerpt,
        imageUrl: newsletterImageUrl,
        slug: newsletterSlug,
        eventDays: newsletterEventDays
      })
    );

    // Send test email directly (not as broadcast)
    const { data, error } = await resend.emails.send({
      from: 'Parkbad Gütersloh <newsletter@parkbad-gt.de>',
      to: [testEmail],
      subject,
      replyTo: 'verwaltung@parkbad-gt.de',
      html: emailHtml,
      text: `
        [TEST-E-MAIL]
        ${newsletterType === 'post' ? 'Neue Neuigkeit' : 'Neue Veranstaltung'}: ${newsletterTitle}
        
        ${newsletterExcerpt || ''}
        
        ${newsletterType === 'event' && newsletterEventDays ? 
          newsletterEventDays.map(day => 
            `${new Date(day.date).toLocaleDateString('de-DE')}, ${day.startTime} - ${day.endTime}`
          ).join('\n') 
          : ''
        }
        
        Mehr erfahren: ${process.env.NEXT_PUBLIC_BASE_URL}/${newsletterSlug}
        
        --
        Parkbad Gütersloh Newsletter (Test-E-Mail)
      `.trim()
    });

    if (error) {
      console.error('Test email send error:', error);
      return NextResponse.json(
        { error: 'Failed to send test email', details: error },
        { status: 500 }
      );
    }

    console.log('✅ Test email sent successfully:', data);

    return NextResponse.json({ 
      success: true, 
      message: 'Test email sent successfully',
      emailId: data?.id
    });

  } catch (error) {
    console.error('Test newsletter error:', error);
    return NextResponse.json(
      { error: 'Failed to send test newsletter', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
