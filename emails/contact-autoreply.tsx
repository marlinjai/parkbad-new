// emails/contact-autoreply.tsx
import { ContactAutoReplyTemplate } from '../src/app/_components/email_templates/contact-autoreply-template';

// Auto-reply when winter break is active
export function ContactAutoReplyClosed() {
  return (
    <ContactAutoReplyTemplate
      firstName="Max"
      lastName="Mustermann"
      isOpen={false}
      winterBreakMessage="Während der Winterpause wird unser E-Mail-Postfach nicht regelmäßig überwacht. Für dringende Anfragen rufen Sie bitte unsere Telefonnummer an und hinterlassen Sie eine Nachricht - wir werden uns dann bei Ihnen melden."
      contactPhone="+49 5241 23 58 58"
      contactEmail="verwaltung@parkbad-gt.de"
    />
  );
}

// Auto-reply when normal operation
export function ContactAutoReplyOpen() {
  return (
    <ContactAutoReplyTemplate
      firstName="Anna"
      lastName="Schmidt"
      isOpen={true}
      normalMessage="Wir haben Ihre Anfrage erhalten und werden uns schnellstmöglich bei Ihnen melden."
      contactPhone="+49 5241 23 58 58"
      contactEmail="verwaltung@parkbad-gt.de"
    />
  );
}

// Simple auto-reply with defaults
export default function ContactAutoReplySimple() {
  return (
    <ContactAutoReplyTemplate
      firstName="Julia"
      lastName="Weber"
      isOpen={false}
    />
  );
}
