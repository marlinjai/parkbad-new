import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { WelcomeTemplate } from '../../_components/email_templates/welcome-template';
import { render } from '@react-email/render';
import React from 'react';

const resend = new Resend(process.env.RESEND_API_KEY);

interface NewsletterRequestBody {
  email: string;
}

// Retry utility function with exponential backoff
async function retryWithBackoff<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  let lastError: Error;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;
      console.log(`Attempt ${attempt}/${maxRetries} failed:`, error);
      
      // Don't retry on the last attempt
      if (attempt === maxRetries) {
        break;
      }
      
      // Exponential backoff: 1s, 2s, 4s
      const delay = baseDelay * Math.pow(2, attempt - 1);
      console.log(`Retrying in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError!;
}

export async function POST(request: NextRequest) {
  try {
    const { email }: NewsletterRequestBody = await request.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Gültige E-Mail-Adresse erforderlich' },
        { status: 400 }
      );
    }

    const audienceId = process.env.RESEND_AUDIENCE_ID;
    if (!audienceId) {
      console.error('RESEND_AUDIENCE_ID not configured');
      return NextResponse.json(
        { error: 'Newsletter-Service nicht konfiguriert' },
        { status: 500 }
      );
    }

    // Check if already subscribed using list contacts with retry logic
    try {
      const { data, error: listError } = await retryWithBackoff(
        async () => {
          return await resend.contacts.list({
            audienceId: audienceId,
          });
        },
        2, // 2 retries for contact check (less critical)
        500 // 500ms base delay
      );
      
      if (listError) {
        console.log('Contact list error:', listError);
      }
      
      // data.data contains the actual array of contacts
      // @ts-ignore
      const contactsList = data?.data || [];
      
      // Check if email already exists in the contact list
      const existingContact = contactsList.find((contact: any) => contact.email === email);
      
      if (existingContact && !existingContact.unsubscribed) {
        return NextResponse.json(
          { error: 'Diese E-Mail-Adresse ist bereits angemeldet' },
          { status: 400 }
        );
      }
    } catch (checkError: any) {
      console.log('Contact list check error (proceeding with signup):', checkError);
    }

    // Generate confirmation token and URL
    const confirmationToken = Math.random().toString(36).substring(2) + Date.now().toString(36);
    const confirmationUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/newsletter/confirm?token=${confirmationToken}&email=${encodeURIComponent(email)}`;

    // Send confirmation email using React Email template
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    
    console.log('Sending email to:', email);
    
    // Render the welcome email template using React Email
    const emailHtml = await render(
      React.createElement(WelcomeTemplate, {
        confirmationUrl,
        email
      })
    );

    const { data: emailData, error: emailError } = await retryWithBackoff(
      async () => {
        return await resend.emails.send({
          from: 'Parkbad Gütersloh <newsletter@parkbad-gt.de>',
          to: [email],
          subject: 'Parkbad Gütersloh Newsletter - Anmeldung bestätigen',
          replyTo: 'verwaltung@parkbad-gt.de',
          headers: {
            'X-Mailer': 'Parkbad Gütersloh Newsletter System',
            'List-Unsubscribe': `<${baseUrl}/api/newsletter/unsubscribe?email=${encodeURIComponent(email)}>`,
            'List-Id': 'Parkbad Gütersloh Newsletter <newsletter.parkbad-gt.de>',
            'X-Entity-Ref-ID': confirmationToken,
            'Message-ID': `<${confirmationToken}@parkbad-gt.de>`,
            'Return-Path': 'newsletter@parkbad-gt.de'
          },
          tags: [
            {
              name: 'category',
              value: 'newsletter-confirmation'
            },
            {
              name: 'environment',
              value: process.env.NODE_ENV || 'development'
            }
          ],
          html: emailHtml,
          text: `
Willkommen beim Parkbad Gütersloh Newsletter!

Um Ihre Anmeldung zu bestätigen, besuchen Sie: ${confirmationUrl}

Mit freundlichen Grüßen
Ihr Team vom Parkbad Gütersloh
          `.trim()
        });
      },
      3, // 3 retries for email sending (critical)
      1000 // 1 second base delay
    );

    if (emailError) {
      console.error('Email send error after retries:', emailError);
      let errorMessage = 'Fehler beim Senden der Bestätigungs-E-Mail';
      if (emailError.message?.includes('timeout')) {
        errorMessage = 'Verbindungsprobleme beim E-Mail-Versand. Bitte versuchen Sie es später erneut.';
      }
      return NextResponse.json(
        { error: errorMessage },
        { status: 500 }
      );
    }

    console.log('Email sent successfully after retries:', emailData);

    return NextResponse.json({ 
      success: true, 
      message: 'Bestätigungs-E-Mail wurde versendet. Bitte prüfen Sie Ihr E-Mail-Postfach und bestätigen Sie Ihre Anmeldung.',
      emailId: emailData?.id
    });

  } catch (error) {
    console.error('Newsletter signup error:', error);
    let errorMessage = 'Fehler bei der Newsletter-Anmeldung';
    if (error instanceof Error && (error.message?.includes('timeout') || (error as any).code === 'UND_ERR_CONNECT_TIMEOUT')) {
      errorMessage = 'Verbindungsprobleme. Bitte versuchen Sie es in einigen Minuten erneut.';
    }
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}