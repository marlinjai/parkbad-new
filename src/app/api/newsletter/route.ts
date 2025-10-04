import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

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

    // Send confirmation email with dark mode support and logo using retry logic
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const logoUrl = `${baseUrl}/parkbad-logo-filtered.svg`;
    
    console.log('Sending email to:', email);
    
    const { data: emailData, error: emailError } = await retryWithBackoff(
      async () => {
        return await resend.emails.send({
          from: 'no-reply@parkbad-gt.de',
          to: [email],
          subject: 'Parkbad Gütersloh Newsletter - Anmeldung bestätigen',
          html: `
            <!DOCTYPE html>
            <html>
            <head>
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <meta name="color-scheme" content="light dark">
              <meta name="supported-color-schemes" content="light dark">
            </head>
            <body style="margin: 0; padding: 20px 0; font-family: Arial, sans-serif; background-color: #f9fafb;">
              <div style="max-width: 600px; margin: 0 auto; background: white;">
                <!-- Header with logo and gradient -->
                <div style="background: linear-gradient(to bottom right, #1A5E6F, #1A6576, #187D8C); color: white; padding: 30px 20px; text-align: center; border-radius: 8px 8px 0 0;">
                  <img src="${logoUrl}" alt="Parkbad Gütersloh" style="max-width: 120px; height: auto; margin-bottom: 15px;">
                  <h1 style="margin: 10px 0 0 0; font-size: 24px; font-weight: bold;">Parkbad Gütersloh</h1>
                  <p style="margin: 5px 0 0 0; font-size: 14px; opacity: 0.9;">Newsletter Anmeldung bestätigen</p>
                </div>
                
                <!-- Content -->
                <div style="padding: 30px 20px; border: 1px solid #e5e7eb; border-top: none;">
                  <h2 style="color: #1f2937; font-size: 20px; margin: 0 0 15px 0; font-weight: bold;">Willkommen beim Newsletter!</h2>
                  <p style="color: #4b5563; font-size: 16px; line-height: 1.5; margin: 0 0 20px 0;">
                    Vielen Dank für Ihr Interesse an unserem Newsletter! Um Ihre Anmeldung zu vervollständigen, bestätigen Sie bitte Ihre E-Mail-Adresse.
                  </p>
                  
                  <!-- Confirmation button -->
                  <div style="text-align: center; margin: 30px 0;">
                    <a href="${confirmationUrl}" style="background: linear-gradient(to bottom right, #1A5E6F, #1A6576, #187D8C); color: white; padding: 15px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold; font-size: 16px;">
                      Newsletter-Anmeldung bestätigen
                    </a>
                  </div>
                  
                  <p style="color: #6b7280; font-size: 12px; line-height: 1.4; margin: 20px 0;">
                    Falls der Button nicht funktioniert, kopieren Sie diesen Link: <br>
                    <span style="word-break: break-all;">${confirmationUrl}</span>
                  </p>
                </div>
                
                <!-- Footer -->
                <div style="padding: 20px; background: #f9fafb; text-align: center; border-radius: 0 0 8px 8px;">
                  <p style="color: #4b5563; font-size: 14px; margin: 0 0 10px 0; line-height: 1.5;">
                    Mit freundlichen Grüßen<br>
                    <strong>Ihr Team vom Parkbad Gütersloh</strong>
                  </p>
                  <p style="color: #6b7280; font-size: 12px; margin: 0; line-height: 1.5;">
                    Am Parkbad 7-9, 33332 Gütersloh<br>
                    +49 5241 23 58 58 | verwaltung@parkbad-gt.de
                  </p>
                </div>
              </div>
              
              <!-- Dark mode styles -->
              <style>
                @media (prefers-color-scheme: dark) {
                  body { background-color: #1f2937 !important; }
                  .email-container { background: #111827 !important; border-color: #374151 !important; }
                  .content-section { background: #111827 !important; border-color: #374151 !important; }
                  .content-section h2 { color: #f3f4f6 !important; }
                  .content-section p { color: #d1d5db !important; }
                  .footer-section { background: #1f2937 !important; }
                  .footer-section p { color: #d1d5db !important; }
                }
              </style>
            </body>
            </html>
          `,
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