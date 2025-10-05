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
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://parkbad-gt.de';
    const logoUrl = `${baseUrl}/Logo_redo_origclolours.png`;
    
    return new Response(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Fehler bei der Bestätigung - Parkbad Gütersloh</title>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style>
          body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen-Sans, Ubuntu, Cantarell, 'Helvetica Neue', sans-serif;
            margin: 0;
            padding: 0;
            min-height: 100vh;
            background: linear-gradient(135deg, #1A5E6F 0%, #1A6576 50%, #187D8C 100%);
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .container { 
            background-color: #ffffff;
            border-radius: 16px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.15);
            padding: 40px;
            max-width: 500px;
            width: 90%;
            text-align: center;
            position: relative;
            overflow: hidden;
          }
          .container::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 4px;
            background: linear-gradient(90deg, #dc2626, #ef4444);
          }
          .logo {
            width: 120px;
            height: 120px;
            margin: 0 auto 20px auto;
            display: block;
            border-radius: 12px;
            box-shadow: 0 4px 12px rgba(26, 94, 111, 0.2);
          }
          h1 { 
            color: #dc2626;
            font-size: 28px;
            font-weight: bold;
            margin: 20px 0;
            line-height: 1.3;
          }
          .error-icon {
            width: 60px;
            height: 60px;
            background: linear-gradient(135deg, #dc2626, #ef4444);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 20px auto;
            box-shadow: 0 4px 12px rgba(220, 38, 38, 0.3);
          }
          .error-icon::after {
            content: '!';
            color: white;
            font-size: 28px;
            font-weight: bold;
          }
          p { 
            font-size: 16px;
            line-height: 1.6;
            color: #4b5563;
            margin: 16px 0;
          }
          .button {
            display: inline-block;
            background: linear-gradient(135deg, #1A5E6F, #1A6576, #187D8C);
            color: white;
            text-decoration: none;
            padding: 14px 28px;
            border-radius: 8px;
            font-weight: 600;
            font-size: 16px;
            margin-top: 20px;
            transition: transform 0.2s ease, box-shadow 0.2s ease;
            box-shadow: 0 4px 12px rgba(26, 94, 111, 0.3);
          }
          .button:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(26, 94, 111, 0.4);
          }
        </style>
      </head>
      <body>
        <div class="container">
          <img src="${logoUrl}" alt="Parkbad Gütersloh Logo" class="logo">
          <div class="error-icon"></div>
          <h1>Fehler bei der Bestätigung</h1>
          <p>Der Bestätigungslink ist ungültig oder abgelaufen. Bitte versuchen Sie die Anmeldung erneut.</p>
          <a href="${baseUrl}" class="button">Zurück zur Startseite</a>
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
          <title>Fehler bei der Bestätigung - Parkbad Gütersloh</title>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style>
            body { 
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen-Sans, Ubuntu, Cantarell, 'Helvetica Neue', sans-serif;
              margin: 0;
              padding: 0;
              min-height: 100vh;
              background: linear-gradient(135deg, #1A5E6F 0%, #1A6576 50%, #187D8C 100%);
              display: flex;
              align-items: center;
              justify-content: center;
            }
            .container { 
              background-color: #ffffff;
              border-radius: 16px;
              box-shadow: 0 20px 40px rgba(0,0,0,0.15);
              padding: 40px;
              max-width: 500px;
              width: 90%;
              text-align: center;
              position: relative;
              overflow: hidden;
            }
            .container::before {
              content: '';
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              height: 4px;
              background: linear-gradient(90deg, #dc2626, #ef4444);
            }
            .logo {
              width: 120px;
              height: 120px;
              margin: 0 auto 20px auto;
              display: block;
              border-radius: 12px;
              box-shadow: 0 4px 12px rgba(26, 94, 111, 0.2);
            }
            h1 { 
              color: #dc2626;
              font-size: 28px;
              font-weight: bold;
              margin: 20px 0;
              line-height: 1.3;
            }
            .error-icon {
              width: 60px;
              height: 60px;
              background: linear-gradient(135deg, #dc2626, #ef4444);
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              margin: 0 auto 20px auto;
              box-shadow: 0 4px 12px rgba(220, 38, 38, 0.3);
            }
            .error-icon::after {
              content: '!';
              color: white;
              font-size: 28px;
              font-weight: bold;
            }
            p { 
              font-size: 16px;
              line-height: 1.6;
              color: #4b5563;
              margin: 16px 0;
            }
            .button {
              display: inline-block;
              background: linear-gradient(135deg, #1A5E6F, #1A6576, #187D8C);
              color: white;
              text-decoration: none;
              padding: 14px 28px;
              border-radius: 8px;
              font-weight: 600;
              font-size: 16px;
              margin-top: 20px;
              transition: transform 0.2s ease, box-shadow 0.2s ease;
              box-shadow: 0 4px 12px rgba(26, 94, 111, 0.3);
            }
            .button:hover {
              transform: translateY(-2px);
              box-shadow: 0 6px 20px rgba(26, 94, 111, 0.4);
            }
          </style>
        </head>
        <body>
          <div class="container">
            <img src="${process.env.NEXT_PUBLIC_BASE_URL}/Logo_redo_origclolours.png" alt="Parkbad Gütersloh Logo" class="logo">
            <div class="error-icon"></div>
            <h1>Fehler bei der Bestätigung</h1>
            <p>${errorMessage}</p>
            <a href="${process.env.NEXT_PUBLIC_BASE_URL}" class="button">Zurück zur Startseite</a>
          </div>
        </body>
        </html>
      `, { headers: { 'Content-Type': 'text/html' } });
    }

    console.log('Contact creation successful after retries:', contactData);

    // Return success page with gradient background and logo
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://parkbad-gt.de';
    const logoUrl = `${baseUrl}/Logo_redo_origclolours.png`;
    
    return new Response(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Newsletter-Anmeldung bestätigt - Parkbad Gütersloh</title>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style>
          body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen-Sans, Ubuntu, Cantarell, 'Helvetica Neue', sans-serif;
            margin: 0;
            padding: 0;
            min-height: 100vh;
            background: linear-gradient(135deg, #1A5E6F 0%, #1A6576 50%, #187D8C 100%);
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .container { 
            background-color: #ffffff;
            border-radius: 16px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.15);
            padding: 40px;
            max-width: 500px;
            width: 90%;
            text-align: center;
            position: relative;
            overflow: hidden;
          }
          .container::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 4px;
            background: linear-gradient(90deg, #1A5E6F, #1A6576, #187D8C);
          }
          .logo {
            width: 120px;
            height: 120px;
            margin: 0 auto 20px auto;
            display: block;
            border-radius: 12px;
            box-shadow: 0 4px 12px rgba(26, 94, 111, 0.2);
          }
          h1 { 
            color: #1A5E6F;
            font-size: 28px;
            font-weight: bold;
            margin: 20px 0;
            line-height: 1.3;
          }
          .success-icon {
            width: 60px;
            height: 60px;
            background: linear-gradient(135deg, #16a34a, #22c55e);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 20px auto;
            box-shadow: 0 4px 12px rgba(22, 163, 74, 0.3);
          }
          .success-icon::after {
            content: '✓';
            color: white;
            font-size: 28px;
            font-weight: bold;
          }
          p { 
            font-size: 16px;
            line-height: 1.6;
            color: #4b5563;
            margin: 16px 0;
          }
          .highlight {
            color: #1A5E6F;
            font-weight: 600;
          }
          .button {
            display: inline-block;
            background: linear-gradient(135deg, #1A5E6F, #1A6576, #187D8C);
            color: white;
            text-decoration: none;
            padding: 14px 28px;
            border-radius: 8px;
            font-weight: 600;
            font-size: 16px;
            margin-top: 20px;
            transition: transform 0.2s ease, box-shadow 0.2s ease;
            box-shadow: 0 4px 12px rgba(26, 94, 111, 0.3);
          }
          .button:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(26, 94, 111, 0.4);
          }
          .footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            font-size: 14px;
            color: #6b7280;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <img src="${logoUrl}" alt="Parkbad Gütersloh Logo" class="logo">
          <div class="success-icon"></div>
          <h1>Anmeldung erfolgreich!</h1>
          <p>Vielen Dank für die Bestätigung Ihrer E-Mail-Adresse.</p>
          <p>Sie sind nun für den <span class="highlight">Parkbad Gütersloh Newsletter</span> angemeldet und erhalten zukünftig Informationen über Neuigkeiten, Veranstaltungen und besondere Angebote.</p>
          <a href="${baseUrl}" class="button">Zurück zur Startseite</a>
          <div class="footer">
            <p><strong>Parkbad Gütersloh</strong><br>
            Am Parkbad 7-9, 33332 Gütersloh<br>
            +49 5241 23 58 58</p>
          </div>
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
        <title>Fehler bei der Bestätigung - Parkbad Gütersloh</title>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style>
          body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen-Sans, Ubuntu, Cantarell, 'Helvetica Neue', sans-serif;
            margin: 0;
            padding: 0;
            min-height: 100vh;
            background: linear-gradient(135deg, #1A5E6F 0%, #1A6576 50%, #187D8C 100%);
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .container { 
            background-color: #ffffff;
            border-radius: 16px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.15);
            padding: 40px;
            max-width: 500px;
            width: 90%;
            text-align: center;
            position: relative;
            overflow: hidden;
          }
          .container::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 4px;
            background: linear-gradient(90deg, #dc2626, #ef4444);
          }
          .logo {
            width: 120px;
            height: 120px;
            margin: 0 auto 20px auto;
            display: block;
            border-radius: 12px;
            box-shadow: 0 4px 12px rgba(26, 94, 111, 0.2);
          }
          h1 { 
            color: #dc2626;
            font-size: 28px;
            font-weight: bold;
            margin: 20px 0;
            line-height: 1.3;
          }
          .error-icon {
            width: 60px;
            height: 60px;
            background: linear-gradient(135deg, #dc2626, #ef4444);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 20px auto;
            box-shadow: 0 4px 12px rgba(220, 38, 38, 0.3);
          }
          .error-icon::after {
            content: '!';
            color: white;
            font-size: 28px;
            font-weight: bold;
          }
          p { 
            font-size: 16px;
            line-height: 1.6;
            color: #4b5563;
            margin: 16px 0;
          }
          .button {
            display: inline-block;
            background: linear-gradient(135deg, #1A5E6F, #1A6576, #187D8C);
            color: white;
            text-decoration: none;
            padding: 14px 28px;
            border-radius: 8px;
            font-weight: 600;
            font-size: 16px;
            margin-top: 20px;
            transition: transform 0.2s ease, box-shadow 0.2s ease;
            box-shadow: 0 4px 12px rgba(26, 94, 111, 0.3);
          }
          .button:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(26, 94, 111, 0.4);
          }
        </style>
      </head>
      <body>
        <div class="container">
          <img src="${process.env.NEXT_PUBLIC_BASE_URL}/Logo_redo_origclolours.png" alt="Parkbad Gütersloh Logo" class="logo">
          <div class="error-icon"></div>
          <h1>Fehler bei der Bestätigung</h1>
          <p>${errorMessage}</p>
          <a href="${process.env.NEXT_PUBLIC_BASE_URL}" class="button">Zurück zur Startseite</a>
        </div>
      </body>
      </html>
    `, { headers: { 'Content-Type': 'text/html' } });
  }
}