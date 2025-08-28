// src/app/api/send/route.ts
import { Resend } from "resend";
import React from "react";

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

    const data = await resend.emails.send({
      from: "sending@whiz-art.com",
      to: ["verwaltung@parkbad-gt.de"],
      subject: `Neue Nachricht von ${requestBody.firstName} ${requestBody.lastName}`,
      react: React.createElement('div', {}, [
        React.createElement('h1', { key: 'title' }, [
          'Hello Parkbad Team!',
          React.createElement('br', { key: 'br1' }),
          `You have a new contact form submission from ${requestBody.firstName} ${requestBody.lastName}.`
        ]),
        React.createElement('h2', { key: 'details' }, 'Here are the details:'),
        React.createElement('h3', { key: 'name' }, `Name: ${requestBody.firstName} ${requestBody.lastName}`),
        React.createElement('h3', { key: 'email' }, `Email: ${requestBody.email}`),
        React.createElement('h3', { key: 'phone' }, `Phone: ${requestBody.phone}`),
        React.createElement('h3', { key: 'message' }, `Message: ${requestBody.message}`),
        React.createElement('h1', { key: 'footer' }, [
          'Best regards,',
          React.createElement('br', { key: 'br2' }),
          'Your WhizArt Team'
        ])
      ]),
      text: `neue Nachricht von ${requestBody.firstName} ${requestBody.lastName} - Email: ${requestBody.email} - Phone: ${requestBody.phone} - Message: ${requestBody.message}`,
    });

    return Response.json(data);
  } catch (error) {
    return Response.json({ error });
  }
}
