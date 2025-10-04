import { NextRequest, NextResponse } from 'next/server';
import  { Resend }  from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

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

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');
  const email = searchParams.get('email');
  const audienceId = process.env.RESEND_AUDIENCE_ID;

  if (!token || !email || !audienceId) {
    return new Response(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Fehler bei der Bestätigung</title>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style>
          body { font-family: Arial, sans-serif; text-align: center; padding: 50px; background-color: #f8f8f8; color: #333; }
          .container { background-color: #fff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); padding: 30px; max-width: 500px; margin: 0 auto; }
          h1 { color: #dc2626; }
          p { font-size: 16px; }
          a { color: #2563eb; text-decoration: none; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Fehler bei der Bestätigung</h1>
          <p>Der Bestätigungslink ist ungültig oder abgelaufen. Bitte versuchen Sie die Anmeldung erneut.</p>
          <p><a href="${process.env.NEXT_PUBLIC_BASE_URL}">Zurück zur Startseite</a></p>
        </div>
      </body>
      </html>
    `, { headers: { 'Content-Type': 'text/html' } });
  }

  try {
    // Add confirmed subscriber to Resend audience with retry logic
    console.log('Creating contact with retry logic:', {
      email: decodeURIComponent(email),
      audienceId: audienceId,
      unsubscribed: false,
    });
    
    const { data: contactData, error: contactError } = await retryWithBackoff(
      async () => {
        return await resend.contacts.create({
          email: decodeURIComponent(email),
          audienceId: audienceId,
          unsubscribed: false,
        });
      },
      3, // 3 retries
      1000 // 1 second base delay
    );
    
    if (contactError) {
      console.error('Contact creation error after retries:', contactError);
      
      let errorMessage = 'Ein unbekannter Fehler ist aufgetreten.';
      if (contactError.message && contactError.message.includes('already exists')) {
        errorMessage = 'Diese E-Mail-Adresse ist bereits angemeldet.';
      } else if (contactError.message && contactError.message.includes('timeout')) {
        errorMessage = 'Verbindungsproblem. Bitte versuchen Sie es später erneut.';
      }
      
      return new Response(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Fehler bei der Bestätigung</title>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style>
            body { font-family: Arial, sans-serif; text-align: center; padding: 50px; background-color: #f8f8f8; color: #333; }
            .container { background-color: #fff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); padding: 30px; max-width: 500px; margin: 0 auto; }
            h1 { color: #dc2626; }
            p { font-size: 16px; }
            a { color: #2563eb; text-decoration: none; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Fehler bei der Bestätigung</h1>
            <p>${errorMessage}</p>
            <p><a href="${process.env.NEXT_PUBLIC_BASE_URL}">Zurück zur Startseite</a></p>
          </div>
        </body>
        </html>
      `, { headers: { 'Content-Type': 'text/html' } });
    }

    console.log('Contact creation successful after retries:', contactData);

    // Return success page
    return new Response(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Newsletter-Anmeldung bestätigt</title>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style>
          body { font-family: Arial, sans-serif; text-align: center; padding: 50px; background-color: #f8f8f8; color: #333; }
          .container { background-color: #fff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); padding: 30px; max-width:500px; margin: 0 auto; }
          h1 { color: #16a34a; }
          p { font-size: 16px; }
          a { color: #2563eb; text-decoration: none; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Anmeldung erfolgreich!</h1>
          <p>Vielen Dank für die Bestätigung Ihrer E-Mail-Adresse. Sie sind nun für den Parkbad Gütersloh Newsletter angemeldet.</p>
          <p><a href="${process.env.NEXT_PUBLIC_BASE_URL}">Zurück zur Startseite</a></p>
        </div>
      </body>
      </html>
    `, { headers: { 'Content-Type': 'text/html' } });

  } catch (error: any) {
    console.error('Error confirming newsletter after all retries:', error);
    
    let errorMessage = 'Es gab ein Problem bei der Bestätigung. Bitte versuchen Sie es später erneut.';
    if (error.code === 'UND_ERR_CONNECT_TIMEOUT' || error.message?.includes('timeout')) {
      errorMessage = 'Verbindungsprobleme - bitte versuchen Sie es in einigen Minuten erneut.';
    }
    
    return new Response(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Fehler bei der Bestätigung</title>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style>
          body { font-family: Arial, sans-serif; text-align: center; padding: 50px; background-color: #f8f8f8; color: #333; }
          .container { background-color: #fff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); padding: 30px; max-width: 500px; margin: 0 auto; }
          h1 { color: #dc2626; }
          p { font-size: 16px; }
          a { color: #2563eb; text-decoration: none; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Fehler bei der Bestätigung</h1>
          <p>${errorMessage}</p>
          <p><a href="${process.env.NEXT_PUBLIC_BASE_URL}">Zurück zur Startseite</a></p>
        </div>
      </body>
      </html>
    `, { headers: { 'Content-Type': 'text/html' } });
  }
}