// src/app/api/newsletter/send/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { NewsletterTemplate } from '../../../_components/email_templates/newsletter-template';
import { render } from '@react-email/render';
import React from 'react';

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendNewsletterRequest {
  type: 'post' | 'event';
  title: string;
  excerpt?: string;
  slug: string;
  imageUrl?: string;
  eventDays?: Array<{
    date: string;
    startTime: string;
    endTime: string;
    description?: string;
  }>;
  secret?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: SendNewsletterRequest = await request.json();
    
    // Verify secret token for security
    if (body.secret !== process.env.SANITY_REVALIDATE_SECRET) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { type, title, excerpt, slug, imageUrl, eventDays } = body;

    // Validate required fields
    if (!type || !title || !slug) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const audienceId = process.env.RESEND_AUDIENCE_ID;
    if (!audienceId) {
      return NextResponse.json(
        { error: 'Newsletter service not configured' },
        { status: 500 }
      );
    }

    // Create email subject
    const subject = type === 'post' 
      ? `Parkbad Gütersloh: ${title}`
      : `Neue Veranstaltung im Parkbad Gütersloh: ${title}`;

    // Render the email template using React Email
    const emailHtml = await render(
      React.createElement(NewsletterTemplate, {
        type,
        title,
        excerpt,
        imageUrl,
        slug,
        eventDays
      })
    );

    // Step 1: Create the broadcast
    const createResponse = await resend.broadcasts.create({
      from: 'newsletter@parkbad-gt.de',
      audienceId: audienceId,
      subject,
      html: emailHtml,
      text: `
        ${type === 'post' ? 'Neue Neuigkeit' : 'Neue Veranstaltung'}: ${title}
        
        ${excerpt || ''}
        
        ${type === 'event' && eventDays ? 
          eventDays.map(day => 
            `${new Date(day.date).toLocaleDateString('de-DE')}, ${day.startTime} - ${day.endTime}`
          ).join('\n') 
          : ''
        }
        
        Mehr erfahren: ${process.env.NEXT_PUBLIC_BASE_URL}/${slug}
        
        --
        Parkbad Gütersloh Newsletter
      `.trim()
    });

    console.log('Broadcast created:', createResponse);

    // Handle creation errors
    if (createResponse.error) {
      console.error('Broadcast creation error:', createResponse.error);
      return NextResponse.json(
        { error: 'Failed to create broadcast', details: createResponse.error },
        { status: 500 }
      );
    }

    const broadcastId = createResponse.data?.id;
    if (!broadcastId) {
      console.error('No broadcast ID returned from create');
      return NextResponse.json(
        { error: 'Failed to get broadcast ID' },
        { status: 500 }
      );
    }

    // Step 2: Send the broadcast
    const sendResponse = await resend.broadcasts.send(broadcastId);

    console.log('Broadcast sent:', sendResponse);

    // Handle send errors
    if (sendResponse.error) {
      console.error('Broadcast send error:', sendResponse.error);
      return NextResponse.json(
        { error: 'Failed to send broadcast', details: sendResponse.error },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      broadcastId: broadcastId,
      message: 'Newsletter broadcast sent successfully' 
    });

  } catch (error) {
    console.error('Newsletter send error:', error);
    return NextResponse.json(
      { error: 'Failed to send newsletter' },
      { status: 500 }
    );
  }
}
