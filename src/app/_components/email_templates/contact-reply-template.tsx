// src/app/_components/email_templates/contact-reply-template.tsx
import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import * as React from 'react';

interface ContactReplyTemplateProps {
  firstName?: string;
  body: string;
  contactPhone?: string;
  contactEmail?: string;
}

export const ContactReplyTemplate = ({
  firstName,
  body,
  contactPhone = '+49 5241 23 58 58',
  contactEmail = 'verwaltung@parkbad-gt.de',
}: ContactReplyTemplateProps) => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://parkbad-gt.de';
  const greetingName = firstName?.trim() || '';
  const paragraphs = body.split(/\n{2,}/);

  return (
    <Html>
      <Head />
      <Preview>Antwort vom Parkbad Gütersloh</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Img
              style={logo}
              src={`${baseUrl}/Logo_redo_origclolours.png`}
              alt="Parkbad Gütersloh"
              width="80"
              height="80"
            />
            <Heading style={headerTitle}>Parkbad Gütersloh</Heading>
            <Text style={headerSubtitle}>Antwort auf Ihre Nachricht</Text>
          </Section>

          <Section style={content}>
            <Text style={paragraph}>
              Hallo{greetingName ? ` ${greetingName}` : ''},
            </Text>
            {paragraphs.map((p, i) => (
              <Text key={i} style={paragraph}>
                {p.split('\n').map((line, j, arr) => (
                  <React.Fragment key={j}>
                    {line}
                    {j < arr.length - 1 ? <br /> : null}
                  </React.Fragment>
                ))}
              </Text>
            ))}
            <Text style={paragraph}>
              Mit freundlichen Grüßen<br />
              Ihr Team vom Parkbad Gütersloh
            </Text>
          </Section>

          <Hr style={hr} />

          <Section style={footer}>
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

const main = {
  backgroundColor: '#ffffff',
  fontFamily: 'Arial, sans-serif',
  margin: '0',
  padding: '0',
};

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
  maxWidth: '600px',
  width: '100%',
};

const header = {
  backgroundColor: '#1A6576',
  background: 'linear-gradient(to bottom right, #202A39, #1A6576, #187D8C)',
  borderRadius: '8px 8px 0 0',
  marginLeft: 'auto',
  marginRight: 'auto',
  padding: '20px',
  textAlign: 'center' as const,
};

const logo = {
  display: 'block',
  margin: '0 auto 15px auto',
  width: '80px',
  height: '80px',
  borderRadius: '8px',
  border: '0',
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

const paragraph = {
  color: '#1f2937',
  fontSize: '16px',
  lineHeight: '1.6',
  marginBottom: '16px',
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

const footerContact = {
  fontSize: '12px',
  color: '#6b7280',
  margin: '0',
  lineHeight: '1.5',
};

const link = {
  color: '#1A6576',
  textDecoration: 'none',
};

export default ContactReplyTemplate;
