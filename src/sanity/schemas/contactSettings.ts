// src/sanity/schemas/contactSettings.ts
import { defineField, defineType } from 'sanity';
import { CogIcon } from '@sanity/icons';

export default defineType({
  name: 'contactSettings',
  title: 'Kontaktformular Einstellungen',
  type: 'document',
  icon: CogIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Titel',
      type: 'string',
      initialValue: 'Kontaktformular Einstellungen',
      readOnly: true,
      description: 'Diese Einstellungen steuern die automatischen Antworten des Kontaktformulars',
    }),
    defineField({
      name: 'isWinterBreak',
      title: 'Winterpause aktiviert',
      type: 'boolean',
      initialValue: false,
      description: 'Wenn aktiviert, wird die Winterpausen-Nachricht in automatischen Antworten verwendet',
    }),
    defineField({
      name: 'winterBreakMessage',
      title: 'Winterpausen-Nachricht',
      type: 'text',
      rows: 4,
      initialValue: 'Während der Winterpause wird unser E-Mail-Postfach nicht regelmäßig überwacht. Für dringende Anfragen rufen Sie bitte unsere Telefonnummer an und hinterlassen Sie eine Nachricht - wir werden uns dann bei Ihnen melden.',
      description: 'Diese Nachricht wird angezeigt, wenn die Winterpause aktiviert ist',
    }),
    defineField({
      name: 'normalMessage',
      title: 'Standard-Nachricht',
      type: 'text',
      rows: 3,
      initialValue: 'Wir haben Ihre Anfrage erhalten und werden uns schnellstmöglich bei Ihnen melden.',
      description: 'Diese Nachricht wird angezeigt, wenn die Winterpause nicht aktiviert ist',
    }),
    defineField({
      name: 'contactPhone',
      title: 'Kontakt-Telefonnummer',
      type: 'string',
      initialValue: '+49 5241 23 58 58',
      description: 'Telefonnummer für dringende Anfragen',
    }),
    defineField({
      name: 'contactEmail',
      title: 'Kontakt-E-Mail',
      type: 'string',
      initialValue: 'verwaltung@parkbad-gt.de',
      description: 'E-Mail-Adresse für Kontaktanfragen',
    }),
    defineField({
      name: 'lastUpdated',
      title: 'Zuletzt aktualisiert',
      type: 'datetime',
      readOnly: true,
      initialValue: () => new Date().toISOString(),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      isWinterBreak: 'isWinterBreak',
      lastUpdated: 'lastUpdated',
    },
    prepare({ title, isWinterBreak, lastUpdated }) {
      return {
        title,
        subtitle: `${isWinterBreak ? '❄️ Winterpause aktiv' : '✅ Normal-Modus'} • Aktualisiert: ${lastUpdated ? new Date(lastUpdated).toLocaleDateString('de-DE') : 'Nie'}`,
      };
    },
  },
});
