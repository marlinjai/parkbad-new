// src/app/_components/email_templates/contact-autoreply-template.tsx
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import * as React from 'react';

interface ContactAutoReplyTemplateProps {
  firstName: string;
  lastName: string;
  isOpen: boolean;
  winterBreakMessage?: string;
  normalMessage?: string;
  contactPhone?: string;
  contactEmail?: string;
}

export const ContactAutoReplyTemplate = ({
  firstName,
  lastName,
  isOpen,
  winterBreakMessage = 'Während der Winterpause wird unser E-Mail-Postfach nicht regelmäßig überwacht. Für dringende Anfragen rufen Sie bitte unsere Telefonnummer an und hinterlassen Sie eine Nachricht - wir werden uns dann bei Ihnen melden.',
  normalMessage = 'Wir haben Ihre Anfrage erhalten und werden uns schnellstmöglich bei Ihnen melden.',
  contactPhone = '+49 5241 23 58 58',
  contactEmail = 'verwaltung@parkbad-gt.de',
}: ContactAutoReplyTemplateProps) => {
  const fullName = `${firstName} ${lastName}`.trim();
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://parkbad-gt.de';

  return (
    <Html>
      <Head />
      <Preview>
        {isOpen 
          ? `Vielen Dank für Ihre Nachricht, ${firstName}!`
          : `Ihre Nachricht ist eingegangen - wir melden uns bald bei Ihnen!`
        }
      </Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Heading style={headerTitle}>Parkbad Gütersloh</Heading>
            <Text style={headerSubtitle}>
              Vielen Dank für Ihre Nachricht
            </Text>
          </Section>

          {/* Content */}
          <Section style={content}>
            <Heading style={contentTitle}>
              Hallo {firstName}!
            </Heading>

            <Text style={paragraph}>
              vielen Dank für Ihre Nachricht über unser Kontaktformular. 
              {isOpen ? normalMessage : 'Wir haben Ihre Anfrage erhalten und werden uns schnellstmöglich bei Ihnen melden.'}
            </Text>

            {!isOpen ? (
              <Section style={closedNotice}>
                <Heading style={closedTitle}>
                  Wir sind derzeit geschlossen
                </Heading>
                <Text style={closedText}>
                  Das Parkbad Gütersloh ist momentan geschlossen.
                </Text>
                <Text style={closedText}>
                  Ihre Nachricht ist dennoch bei uns eingegangen und wir werden sie 
                  schnellstmöglich bearbeiten, sobald wir wieder geöffnet haben.
                </Text>
                <Text style={winterBreakText}>
                  <strong>Wichtiger Hinweis:</strong> {winterBreakMessage}
                </Text>
              </Section>
            ) : (
              <Section style={openNotice}>
                <Text style={openText}>
                  Wir sind derzeit geöffnet und werden Ihre Anfrage so schnell wie möglich bearbeiten.
                </Text>
              </Section>
            )}

            <Text style={paragraph}>
              <strong>Kontaktdaten für dringende Anfragen:</strong><br />
              Telefon: {contactPhone}<br />
              E-Mail: {contactEmail}
            </Text>

            <Section style={buttonSection}>
              <Button style={button} href={baseUrl}>
                Parkbad Gütersloh besuchen
              </Button>
            </Section>
          </Section>

          <Hr style={hr} />

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              Mit freundlichen Grüßen<br />
              Ihr Team vom Parkbad Gütersloh
            </Text>
            <Text style={footerContact}>
              Am Parkbad 7-9, 33332 Gütersloh<br />
              <Link href={`tel:${contactPhone.replace(/\s/g, '')}`} style={link}>{contactPhone}</Link>
              {' | '}
              <Link href={`mailto:${contactEmail}`} style={link}>{contactEmail}</Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

// Styles
const main = {
  backgroundColor: '#ffffff',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
  maxWidth: '600px',
};

const header = {
  background: 'linear-gradient(to bottom right, #202A39, #1A6576, #187D8C)',
  borderRadius: '8px 8px 0 0',
  padding: '20px',
  textAlign: 'center' as const,
};

const headerTitle = {
  color: '#ffffff',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '0',
};

const headerSubtitle = {
  color: '#e0e7ff',
  fontSize: '14px',
  margin: '5px 0 0 0',
};

const content = {
  padding: '30px 20px',
  backgroundColor: '#ffffff',
  border: '1px solid #e5e7eb',
  borderTop: 'none',
};

const contentTitle = {
  color: '#1f2937',
  fontSize: '20px',
  fontWeight: 'bold',
  marginBottom: '15px',
  lineHeight: '1.3',
};

const paragraph = {
  color: '#4b5563',
  fontSize: '16px',
  lineHeight: '1.5',
  marginBottom: '20px',
};

const closedNotice = {
  backgroundColor: '#fef3c7',
  padding: '20px',
  borderRadius: '8px',
  marginBottom: '20px',
  border: '1px solid #f59e0b',
};

const closedTitle = {
  color: '#92400e',
  fontSize: '18px',
  fontWeight: 'bold',
  marginBottom: '10px',
  marginTop: '0',
};

const closedText = {
  color: '#92400e',
  fontSize: '14px',
  lineHeight: '1.5',
  marginBottom: '10px',
};

const winterBreakText = {
  color: '#dc2626',
  fontSize: '14px',
  lineHeight: '1.5',
  marginBottom: '10px',
  padding: '10px',
  backgroundColor: '#fef2f2',
  borderRadius: '4px',
  border: '1px solid #fecaca',
};

const openNotice = {
  backgroundColor: '#d1fae5',
  padding: '15px',
  borderRadius: '8px',
  marginBottom: '20px',
  border: '1px solid #10b981',
};

const openText = {
  color: '#065f46',
  fontSize: '14px',
  lineHeight: '1.5',
  margin: '0',
};

const hoursSection = {
  backgroundColor: '#f3f4f6',
  padding: '15px',
  borderRadius: '6px',
  marginBottom: '20px',
};

const hoursSectionTitle = {
  color: '#1f2937',
  fontSize: '16px',
  fontWeight: 'bold',
  marginBottom: '10px',
  marginTop: '0',
};

const hoursText = {
  color: '#4b5563',
  fontSize: '14px',
  lineHeight: '1.6',
  margin: '0',
  whiteSpace: 'pre-line' as const,
};

const buttonSection = {
  textAlign: 'center' as const,
  margin: '30px 0',
};

const button = {
  background: 'linear-gradient(to bottom right, #1A5E6F, #1A6576, #187D8C)',
  borderRadius: '6px',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '12px 24px',
};

const hr = {
  borderColor: '#e5e7eb',
  margin: '20px 0',
};

const footer = {
  padding: '20px',
  backgroundColor: '#f9fafb',
  borderRadius: '0 0 8px 8px',
  textAlign: 'center' as const,
};

const footerText = {
  color: '#4b5563',
  fontSize: '14px',
  margin: '0 0 15px 0',
  lineHeight: '1.5',
};

const footerContact = {
  fontSize: '12px',
  color: '#6b7280',
  margin: '0',
  lineHeight: '1.5',
};

const link = {
  color: '#1e40af',
  textDecoration: 'none',
};

export default ContactAutoReplyTemplate;
