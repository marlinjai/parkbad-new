// @ts-nocheck
import { defineField, defineType } from 'sanity';
import { EnvelopeIcon } from '@sanity/icons';
import ContactReplyPanel from '@/app/_components/Sanity_Components/ContactReplyPanel';

export default defineType({
  name: 'contactSubmission',
  title: 'Kontakt-Anfrage',
  type: 'document',
  icon: EnvelopeIcon,
  fields: [
    defineField({ name: 'firstName', title: 'Vorname', type: 'string', readOnly: true }),
    defineField({ name: 'lastName', title: 'Nachname', type: 'string', readOnly: true }),
    defineField({ name: 'email', title: 'E-Mail', type: 'string', readOnly: true }),
    defineField({ name: 'phone', title: 'Telefon', type: 'string', readOnly: true }),
    defineField({ name: 'message', title: 'Nachricht', type: 'text', readOnly: true, rows: 8 }),
    defineField({ name: 'receivedAt', title: 'Empfangen am', type: 'datetime', readOnly: true }),
    defineField({ name: 'autoReplyEmailId', type: 'string', readOnly: true, hidden: true }),
    defineField({ name: 'originalMessageId', type: 'string', readOnly: true, hidden: true }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'Offen', value: 'offen' },
          { title: 'In Bearbeitung', value: 'inBearbeitung' },
          { title: 'Erledigt', value: 'erledigt' },
        ],
        layout: 'radio',
      },
      initialValue: 'offen',
    }),
    defineField({ name: 'internalNotes', title: 'Interne Notizen', type: 'text', rows: 4 }),
    defineField({
      name: 'replies',
      title: 'Antworten',
      type: 'array',
      readOnly: true,
      of: [{
        type: 'object',
        fields: [
          defineField({ name: 'sentAt', type: 'datetime' }),
          defineField({ name: 'sentBy', type: 'string' }),
          defineField({ name: 'body', type: 'text' }),
          defineField({ name: 'resendEmailId', type: 'string' }),
        ],
        preview: {
          select: { sentAt: 'sentAt', sentBy: 'sentBy', body: 'body' },
          prepare: ({ sentAt, sentBy, body }) => ({
            title: `${new Date(sentAt).toLocaleString('de-DE')} - ${sentBy}`,
            subtitle: body?.slice(0, 80),
          }),
        },
      }],
    }),
    defineField({
      name: 'replyComposer',
      title: 'Antworten',
      type: 'string',
      components: { input: ContactReplyPanel },
      readOnly: true,
      initialValue: '',
    }),
  ],
  preview: {
    select: { firstName: 'firstName', lastName: 'lastName', message: 'message', status: 'status', receivedAt: 'receivedAt' },
    prepare: ({ firstName, lastName, message, status, receivedAt }) => {
      const statusLabel = status === 'erledigt' ? '✓' : status === 'inBearbeitung' ? '…' : '●';
      return {
        title: `${statusLabel} ${firstName ?? ''} ${lastName ?? ''}`.trim(),
        subtitle: `${receivedAt ? new Date(receivedAt).toLocaleDateString('de-DE') : ''} ${message?.slice(0, 60) ?? ''}`,
      };
    },
  },
  orderings: [
    { name: 'receivedAtDesc', title: 'Neueste zuerst', by: [{ field: 'receivedAt', direction: 'desc' }] },
  ],
});
