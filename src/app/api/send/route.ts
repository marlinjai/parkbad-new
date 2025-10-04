// src/app/api/send/route.ts
import { Resend } from "resend";
import { render } from '@react-email/render';
import React from "react";
import { ContactAutoReplyTemplate } from "../../_components/email_templates/contact-autoreply-template";
import { sanityFetch } from "../../../sanity/lib/sanity.fetch";
import { contactSettingsQuery } from "../../../sanity/lib/sanity.queries";
import { ContactSettings } from "../../../types/sanityTypes";

const resend = new Resend(process.env.RESEND_API_KEY);

// Define an interface for your expected request body
interface EmailRequestBody {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message: string;
}

export async function POST(request: Request) {
  try {
    const requestBody: EmailRequestBody = await request.json();

    // Send notification email to Parkbad team
    const teamNotification = await resend.emails.send({
      from: "no-reply@parkbad-gt.de",
      to: ["verwaltung@parkbad-gt.de"],
      subject: `Neue Nachricht von ${requestBody.firstName} ${requestBody.lastName}`,
      react: React.createElement('div', {}, [
        React.createElement('h1', { key: 'title' }, [
          'Hallo Parkbad Team!',
          React.createElement('br', { key: 'br1' }),
          `Sie haben eine neue Kontaktformular-Nachricht von ${requestBody.firstName} ${requestBody.lastName} erhalten.`
        ]),
        React.createElement('h2', { key: 'details' }, 'Nachrichtendetails:'),
        React.createElement('h3', { key: 'name' }, `Name: ${requestBody.firstName} ${requestBody.lastName}`),
        React.createElement('h3', { key: 'email' }, `E-Mail: ${requestBody.email}`),
        React.createElement('h3', { key: 'phone' }, `Telefon: ${requestBody.phone}`),
        React.createElement('div', { key: 'message' }, [
          React.createElement('h3', {}, 'Nachricht:'),
          React.createElement('p', { style: { background: '#f5f5f5', padding: '10px', borderRadius: '5px' } }, requestBody.message)
        ]),
        React.createElement('hr', { key: 'hr' }),
        React.createElement('p', { key: 'footer' }, [
          'Mit freundlichen Grüßen,',
          React.createElement('br', { key: 'br2' }),
          'Ihr Website-System'
        ])
      ]),
      text: `Neue Nachricht von ${requestBody.firstName} ${requestBody.lastName} - E-Mail: ${requestBody.email} - Telefon: ${requestBody.phone} - Nachricht: ${requestBody.message}`,
    });

    // Get contact settings from Sanity and send auto-reply to customer
    try {
      const contactSettings: ContactSettings = await sanityFetch({
        query: contactSettingsQuery,
      });

      // Use default values if no settings found
      const settings = contactSettings || {
        isWinterBreak: false,
        winterBreakMessage: 'Während der Winterpause wird unser E-Mail-Postfach nicht regelmäßig überwacht. Für dringende Anfragen rufen Sie bitte unsere Telefonnummer an und hinterlassen Sie eine Nachricht - wir werden uns dann bei Ihnen melden.',
        normalMessage: 'Wir haben Ihre Anfrage erhalten und werden uns schnellstmöglich bei Ihnen melden.',
        contactPhone: '+49 5241 23 58 58',
        contactEmail: 'verwaltung@parkbad-gt.de'
      };

      // Render auto-reply email
      const autoReplyHtml = await render(
        React.createElement(ContactAutoReplyTemplate, {
          firstName: requestBody.firstName,
          lastName: requestBody.lastName,
          isOpen: !settings.isWinterBreak, // Inverted: winter break means "closed"
          winterBreakMessage: settings.winterBreakMessage,
          normalMessage: settings.normalMessage,
          contactPhone: settings.contactPhone,
          contactEmail: settings.contactEmail
        })
      );

      // Send auto-reply to customer
      const autoReply = await resend.emails.send({
        from: "no-reply@parkbad-gt.de",
        to: [requestBody.email],
        subject: settings.isWinterBreak 
          ? "Ihre Nachricht ist eingegangen - Winterpause"
          : "Ihre Nachricht ist eingegangen - Parkbad Gütersloh",
        html: autoReplyHtml,
        text: `
Hallo ${requestBody.firstName}!

Vielen Dank für Ihre Nachricht über unser Kontaktformular. ${settings.isWinterBreak ? settings.winterBreakMessage : settings.normalMessage}

${settings.isWinterBreak ? `
WICHTIGER HINWEIS: ${settings.winterBreakMessage}
` : ''}

Kontaktdaten für dringende Anfragen:
Telefon: ${settings.contactPhone}
E-Mail: ${settings.contactEmail}

Mit freundlichen Grüßen
Ihr Team vom Parkbad Gütersloh

Am Parkbad 7-9, 33332 Gütersloh
${settings.contactPhone} | ${settings.contactEmail}
        `.trim()
      });

      console.log('Auto-reply sent:', autoReply);
    } catch (autoReplyError) {
      console.error('Failed to send auto-reply:', autoReplyError);
      // Don't fail the main request if auto-reply fails
    }

    return Response.json({ 
      success: true,
      teamNotificationId: (teamNotification as any).id,
      message: 'Nachricht erfolgreich gesendet'
    });

  } catch (error) {
    console.error('Contact form error:', error);
    return Response.json({ 
      error: 'Fehler beim Senden der Nachricht',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}
