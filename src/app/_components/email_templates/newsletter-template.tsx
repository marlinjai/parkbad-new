// src/app/_components/email_templates/newsletter-template.tsx
import {
  Body,
  Button,
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
import { normalizeEventDays } from '@/lib/events/eventDays';

interface NewsletterTemplateProps {
  type: 'post' | 'event';
  title: string;
  excerpt?: string;
  eventContent?: unknown;
  imageUrl?: string;
  slug: string;
  eventDays?: Array<{
    date: string;
    slots: Array<{
      startTime: string;
      endTime: string;
      label?: string;
    }>;
  }>;
}

export const NewsletterTemplate = ({
  type,
  title,
  excerpt,
  eventContent,
  imageUrl,
  slug,
  eventDays,
}: NewsletterTemplateProps) => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://parkbad-gt.de';
  const postUrl = `${baseUrl}/${slug}`;
  
  const normalizeTypography = (value: string) => value.replace(/—/g, '-');

  const renderEventContent = () => {
    if (!Array.isArray(eventContent)) return null;

    type MarkDef = { _key?: string; _type?: string; href?: string };
    type Span = { _type?: string; text?: string; marks?: string[] };
    type Block = {
      _type?: string;
      style?: string;
      listItem?: 'bullet' | 'number';
      children?: Span[];
      markDefs?: MarkDef[];
    };

    let numberIndex = 1;

    return (eventContent as Block[]).map((block, blockIndex) => {
      if (block?._type !== 'block' || !Array.isArray(block.children)) return null;

      const markDefs = block.markDefs ?? [];
      const content = block.children.map((child, childIndex) => {
        if (child?._type !== 'span' || typeof child.text !== 'string') return null;
        const rawText = normalizeTypography(child.text);
        let node: React.ReactNode = rawText;

        for (const mark of child.marks ?? []) {
          if (mark === 'strong') node = <strong key={`${blockIndex}-${childIndex}-${mark}`}>{node}</strong>;
          else if (mark === 'em') node = <em key={`${blockIndex}-${childIndex}-${mark}`}>{node}</em>;
          else if (mark === 'code') node = <code key={`${blockIndex}-${childIndex}-${mark}`}>{node}</code>;
          else {
            const def = markDefs.find((d) => d._key === mark && d._type === 'link' && typeof d.href === 'string');
            if (def?.href) {
              node = (
                <Link key={`${blockIndex}-${childIndex}-${mark}`} href={def.href} style={contentLink}>
                  {node}
                </Link>
              );
            }
          }
        }

        return <React.Fragment key={`${blockIndex}-${childIndex}`}>{node}</React.Fragment>;
      });

      if (block.listItem === 'bullet') {
        return <Text key={blockIndex} style={listItemStyle}>- {content}</Text>;
      }
      if (block.listItem === 'number') {
        const current = numberIndex++;
        return <Text key={blockIndex} style={listItemStyle}>{current}. {content}</Text>;
      }

      numberIndex = 1;

      if (block.style?.startsWith('h1')) return <Heading key={blockIndex} style={contentH1}>{content}</Heading>;
      if (block.style?.startsWith('h2')) return <Heading key={blockIndex} style={contentH2}>{content}</Heading>;
      if (block.style?.startsWith('h3')) return <Heading key={blockIndex} style={contentH3}>{content}</Heading>;
      if (block.style?.startsWith('h4')) return <Heading key={blockIndex} style={contentH4}>{content}</Heading>;
      if (block.style === 'blockquote') return <Text key={blockIndex} style={blockquoteStyle}>{content}</Text>;

      return <Text key={blockIndex} style={excerpt_style}>{content}</Text>;
    });
  };

  const renderEventDays = () => {
    const normalized = normalizeEventDays(eventDays);
    if (normalized.length === 0) return null;

    return normalized.map((day, dayIndex) => {
      const dateStr = new Date(day.date).toLocaleDateString('de-DE', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });

      if (!day.isMultiSlot) {
        const slot = day.slots[0];
        const timeStr = slot ? `${slot.startTime} - ${slot.endTime}` : '';
        return (
          <Text key={dayIndex} style={eventDates}>
            {dateStr}{timeStr ? `, ${timeStr}` : ''}
          </Text>
        );
      }

      return (
        <Section key={dayIndex} style={{ marginBottom: '8px' }}>
          <Text style={{ ...eventDates, fontWeight: 'bold', margin: '0 0 4px 0' }}>
            {dateStr}:
          </Text>
          {day.slots.map((slot, slotIndex) => (
            <Text key={slotIndex} style={{ ...eventDates, margin: '0 0 0 16px' }}>
              {slot.startTime} - {slot.endTime}{slot.label ? `  ${slot.label}` : ''}
            </Text>
          ))}
        </Section>
      );
    });
  };

  const previewText = type === 'post' 
    ? `Neue Neuigkeit: ${title}` 
    : `Neue Veranstaltung: ${title}`;

  return (
    <Html>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta httpEquiv="Content-Type" content="text/html; charset=UTF-8" />
        {/* Outlook-specific styles */}
        <style>{`
          @media screen and (max-width: 600px) {
            .mobile-center { text-align: center !important; }
            .mobile-padding { padding: 10px !important; }
          }
        `}</style>
      </Head>
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header - Pure React Email Components */}
          <Section style={header}>
            <Img 
              style={logo} 
              src={`${baseUrl}/Logo_redo_origclolours.png`} 
              alt="Parkbad Gütersloh" 
              width="80" 
              height="80" 
            />
            <Heading style={headerTitle}>Parkbad Gütersloh</Heading>
            <Text style={headerSubtitle}>
              {type === 'post' ? 'Neuer Beitrag' : 'Neue Veranstaltung'}
            </Text>
          </Section>

          {/* Content */}
          <Section style={content}>
            {imageUrl && (
              <Section style={imageSection}>
                <Img
                  src={imageUrl}
                  alt={title}
                  width="560"
                  style={image}
                />
              </Section>
            )}

            <Heading style={contentTitle}>{title}</Heading>

            {type === 'event' && Array.isArray(eventContent) && eventContent.length > 0 ? (
              <Section style={contentRichSection}>
                {renderEventContent()}
              </Section>
            ) : excerpt ? (
              <Text style={excerpt_style}>{normalizeTypography(excerpt)}</Text>
            ) : null}

            {type === 'event' && eventDays && eventDays.length > 0 && (
              <Section style={eventSection}>
                <Heading style={eventSectionTitle}>Termine:</Heading>
                {renderEventDays()}
              </Section>
            )}

            <Section style={buttonSection}>
              {/* Pure React Email Button */}
              <Button style={button} href={postUrl}>
                {type === 'post' ? 'Beitrag lesen' : 'Veranstaltung ansehen'}
              </Button>
            </Section>
          </Section>

          <Hr style={hr} />

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              Sie erhalten diese E-Mail, weil Sie sich für den Parkbad Gütersloh Newsletter angemeldet haben.
            </Text>
            <Text style={footerLinks}>
              <Link href={baseUrl} style={link}>
                Parkbad Gütersloh besuchen
              </Link>
              {' | '}
              <Link href="{{{RESEND_UNSUBSCRIBE_URL}}}" style={link}>
                Abmelden
              </Link>
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
  fontFamily: 'Arial, sans-serif', // Simplified for better compatibility
  margin: '0',
  padding: '0',
};

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
  maxWidth: '600px',
  width: '100%', // Better mobile support
};

const header = {
  backgroundColor: '#1A6576', // Fallback for gradient
  background: 'linear-gradient(to bottom right, #202A39, #1A6576, #187D8C)',
  borderRadius: '8px 8px 0 0',
  marginLeft: 'auto',
  marginRight: 'auto',
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

const imageSection = {
  marginBottom: '20px',
  textAlign: 'center' as const,
};

const image = {
  maxWidth: '100%',
  height: 'auto',
  borderRadius: '8px',
  border: '1px solid #e5e7eb',
};

const contentTitle = {
  color: '#1f2937',
  fontSize: '20px',
  fontWeight: 'bold',
  marginBottom: '15px',
  lineHeight: '1.3',
};

const excerpt_style = {
  color: '#4b5563',
  fontSize: '16px',
  lineHeight: '1.5',
  marginBottom: '20px',
};

const contentRichSection = { marginBottom: '20px' };

const contentH1 = {
  color: '#1f2937',
  fontSize: '28px',
  fontWeight: 'bold',
  margin: '0 0 12px 0',
  lineHeight: '1.3',
};

const contentH2 = {
  color: '#1f2937',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '0 0 10px 0',
  lineHeight: '1.35',
};

const contentH3 = {
  color: '#1f2937',
  fontSize: '20px',
  fontWeight: 'bold',
  margin: '0 0 10px 0',
  lineHeight: '1.4',
};

const contentH4 = {
  color: '#1f2937',
  fontSize: '18px',
  fontWeight: 'bold',
  margin: '0 0 8px 0',
  lineHeight: '1.4',
};

const listItemStyle = {
  color: '#4b5563',
  fontSize: '16px',
  lineHeight: '1.6',
  margin: '0 0 8px 0',
};

const blockquoteStyle = {
  color: '#374151',
  fontSize: '16px',
  lineHeight: '1.6',
  margin: '0 0 14px 0',
};

const contentLink = {
  color: '#1A6576',
  textDecoration: 'underline',
};

const eventSection = {
  backgroundColor: '#f3f4f6',
  padding: '15px',
  borderRadius: '6px',
  marginBottom: '20px',
};

const eventSectionTitle = {
  color: '#1f2937',
  fontSize: '16px',
  fontWeight: 'bold',
  marginBottom: '10px',
  marginTop: '0',
};

const eventDates = {
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
  backgroundColor: '#1A6576', // Solid fallback for gradient
  background: 'linear-gradient(to bottom right, #1A5E6F, #1A6576, #187D8C)',
  borderRadius: '6px',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '12px 24px',
  border: 'none',
  lineHeight: '1.4',
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
  color: '#6b7280',
  fontSize: '14px',
  margin: '0 0 10px 0',
};

const footerLinks = {
  fontSize: '12px',
  color: '#9ca3af',
  margin: '0',
};

const logo = {
  display: 'block',
  margin: '0 auto 15px auto',
  width: '80px',
  height: '80px',
  borderRadius: '8px',
  border: '0', // Remove border for email clients
};

const link = {
  color: '#6b7280',
  textDecoration: 'none',
};

export default NewsletterTemplate;
