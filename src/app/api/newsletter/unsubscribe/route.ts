// src/app/api/newsletter/unsubscribe/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json(
        { error: 'E-Mail-Adresse erforderlich' },
        { status: 400 }
      );
    }

    const audienceId = process.env.RESEND_AUDIENCE_ID;
    if (!audienceId) {
      return NextResponse.json(
        { error: 'Newsletter-Service nicht konfiguriert' },
        { status: 500 }
      );
    }

    // Find and remove the contact from the audience
    try {
      const { data: contacts } = await resend.contacts.list({
        audienceId: audienceId,
      });

      // @ts-ignore - Resend API types may not be fully accurate
      const contactsList = contacts?.data || [];
      const contact = contactsList.find((c: any) => c.email === email);

      if (contact) {
        await resend.contacts.remove({
          audienceId: audienceId,
          id: contact.id,
        });
      }

      // Return a simple HTML page confirming unsubscription
      return new NextResponse(
        `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Newsletter abgemeldet - Parkbad Gütersloh</title>
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { 
              font-family: Arial, sans-serif; 
              max-width: 600px; 
              margin: 50px auto; 
              padding: 20px; 
              text-align: center;
              background-color: #f9fafb;
            }
            .container {
              background: white;
              padding: 40px;
              border-radius: 8px;
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            h1 { color: #1A5E6F; }
            p { color: #4b5563; line-height: 1.6; }
            .success { color: #059669; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Newsletter abgemeldet</h1>
            <p class="success">Sie wurden erfolgreich vom Parkbad Gütersloh Newsletter abgemeldet.</p>
            <p>Die E-Mail-Adresse <strong>${email}</strong> wird keine weiteren Newsletter-E-Mails erhalten.</p>
            <p>Falls Sie sich versehentlich abgemeldet haben, können Sie sich jederzeit wieder auf unserer Website anmelden.</p>
            <p><a href="${process.env.NEXT_PUBLIC_BASE_URL}" style="color: #1A5E6F;">Zurück zur Parkbad Website</a></p>
          </div>
        </body>
        </html>
        `,
        {
          status: 200,
          headers: {
            'Content-Type': 'text/html; charset=utf-8',
          },
        }
      );

    } catch (error) {
      console.error('Unsubscribe error:', error);
      return NextResponse.json(
        { error: 'Fehler beim Abmelden vom Newsletter' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Unsubscribe request error:', error);
    return NextResponse.json(
      { error: 'Fehler beim Verarbeiten der Anfrage' },
      { status: 500 }
    );
  }
}
