// emails/newsletter.tsx
import { NewsletterTemplate } from '../src/app/_components/email_templates/newsletter-template';

// Post Newsletter Preview
export default function PostNewsletter() {
  return (
    <NewsletterTemplate
      type="post"
      title="Willkommen im Sommer 2026!"
      excerpt="Die warme Jahreszeit ist da und wir haben viele spannende Neuigkeiten für Sie. Erfahren Sie mehr über unsere neuen Angebote und kommenden Veranstaltungen."
      slug="willkommen-sommer-2026"
      imageUrl="https://cdn.sanity.io/images/qyrn8cjm/production/c2064acbb447ee0532bf1a68933735b2f61fde9f-1943x874.jpg?fp-x=0.5&fp-y=0.5&fit=crop&auto=format"
    />
  );
}

// Event Newsletter Preview
export function EventNewsletter() {
  return (
    <NewsletterTemplate
      type="event"
      title="Sommerfest 2024"
      excerpt="Feiern Sie mit uns das große Sommerfest! Musik, Essen und Spaß für die ganze Familie."
      slug="sommerfest-2024"
      imageUrl="https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=600&h=300&fit=crop"
      eventDays={[
        {
          date: '2024-07-15',
          startTime: '14:00',
          endTime: '22:00',
          description: 'Hauptveranstaltung'
        },
        {
          date: '2024-07-16',
          startTime: '10:00',
          endTime: '18:00',
          description: 'Familien-Tag'
        }
      ]}
    />
  );
}

// Newsletter without image
export function SimpleNewsletter() {
  return (
    <NewsletterTemplate
      type="post"
      title="Wichtige Ankündigung"
      excerpt="Wir haben wichtige Neuigkeiten für alle unsere Besucher."
      slug="wichtige-ankuendigung"
    />
  );
}
