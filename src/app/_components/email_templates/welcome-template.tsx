// src/app/_components/email_templates/welcome-template.tsx
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
  Img,
  Text,
} from '@react-email/components';
import * as React from 'react';

interface WelcomeTemplateProps {
  confirmationUrl: string;
  email: string;
}

export const WelcomeTemplate = ({
  confirmationUrl,
  email,
}: WelcomeTemplateProps) => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://parkbad-gt.de';

  return (
    <Html>
      <Head />
      <Preview>Willkommen beim Parkbad Gütersloh Newsletter! Bitte bestätigen Sie Ihre Anmeldung.</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
          <Img style={logo} src="https://www.parkbad-gt.de/_next/image?url=%2F_next%2Fstatic%2Fmedia%2FLogo_redo_origclolours.51065b50.png&w=256&q=75" alt="Parkbad Gütersloh" width="100" height="100" />
            <Heading style={headerTitle}>Parkbad Gütersloh</Heading>
            <Text style={headerSubtitle}>
              Newsletter Anmeldung bestätigen
            </Text>
          </Section>

          {/* Content */}
          <Section style={content}>
            <Heading style={contentTitle}>
              Willkommen beim Newsletter!
            </Heading>

            <Text style={paragraph}>
              Vielen Dank für Ihr Interesse an unserem Newsletter! 
              Um Ihre Anmeldung zu vervollständigen und sicherzustellen, 
              dass Sie unsere Neuigkeiten und Veranstaltungsankündigungen erhalten, 
              bestätigen Sie bitte Ihre E-Mail-Adresse.
            </Text>

            <Section style={confirmationSection}>
              <Text style={confirmationText}>
                <strong>E-Mail-Adresse:</strong> {email}
              </Text>
            </Section>

            <Section style={buttonSection}>
              <Button style={button} href={confirmationUrl}>
                Newsletter-Anmeldung bestätigen
              </Button>
            </Section>

            <Text style={paragraph}>
              Falls der Button nicht funktioniert, kopieren Sie diesen Link 
              in Ihren Browser:
            </Text>
            <Text style={linkText}>
              {confirmationUrl}
            </Text>

            <Section style={benefitsSection}>
              <Heading style={benefitsSectionTitle}>
                Was Sie erwartet:
              </Heading>
              <Text style={benefitsText}>
                ✅ Neuigkeiten und Ankündigungen aus dem Parkbad<br />
                ✅ Informationen zu besonderen Veranstaltungen<br />
                ✅ Saisonale Updates und Öffnungszeiten<br />
                ✅ Exklusive Einblicke und Angebote
              </Text>
            </Section>

            <Text style={noteText}>
              <strong>Hinweis:</strong> Dieser Bestätigungslink ist 24 Stunden gültig. 
              Falls Sie sich nicht für unseren Newsletter angemeldet haben, 
              können Sie diese E-Mail einfach ignorieren.
            </Text>
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
              <Link href="tel:+4952412358558" style={link}>+49 5241 23 58 58</Link>
              {' | '}
              <Link href="mailto:verwaltung@parkbad-gt.de" style={link}>verwaltung@parkbad-gt.de</Link>
              {' | '}
              <Link href={baseUrl} style={link}>parkbad-gt.de</Link>
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
  background: 'linear-gradient(to bottom right, #1A5E6F, #1A6576, #187D8C)',
  borderRadius: '8px 8px 0 0',
  padding: '20px',
  textAlign: 'center' as const,
};

const logo = {
  marginLeft: 'auto',
  marginRight: 'auto',
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

const confirmationSection = {
  backgroundColor: '#f0f9ff',
  padding: '15px',
  borderRadius: '6px',
  marginBottom: '20px',
  border: '1px solid #0284c7',
};

const confirmationText = {
  color: '#0c4a6e',
  fontSize: '14px',
  margin: '0',
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
  padding: '15px 30px',
};

const linkText = {
  color: '#6b7280',
  fontSize: '12px',
  wordBreak: 'break-all' as const,
  marginBottom: '20px',
};

const benefitsSection = {
  backgroundColor: '#f9fafb',
  padding: '20px',
  borderRadius: '6px',
  marginBottom: '20px',
};

const benefitsSectionTitle = {
  color: '#1f2937',
  fontSize: '16px',
  fontWeight: 'bold',
  marginBottom: '10px',
  marginTop: '0',
};

const benefitsText = {
  color: '#4b5563',
  fontSize: '14px',
  lineHeight: '1.6',
  margin: '0',
};

const noteText = {
  color: '#6b7280',
  fontSize: '13px',
  lineHeight: '1.4',
  padding: '15px',
  backgroundColor: '#f8fafc',
  borderRadius: '4px',
  border: '1px solid #e2e8f0',
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
  color: '#1A6576',
  textDecoration: 'none',
};

export default WelcomeTemplate;
