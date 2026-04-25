import 'server-only';
import { Resend } from 'resend';

export interface BroadcastInput {
  type: 'post' | 'event';
  title: string;
  excerpt?: string;
  slug: string;
  imageUrl?: string;
  eventDays?: Array<{ date?: string; startTime?: string; endTime?: string }>;
  audienceId: string;
  htmlBody: string;
}

export interface BroadcastPayload {
  from: string;
  audienceId: string;
  subject: string;
  replyTo: string;
  html: string;
  text: string;
}

export function buildBroadcastPayload(input: BroadcastInput): BroadcastPayload {
  const subject = input.type === 'post'
    ? `Parkbad Gütersloh: ${input.title}`
    : `Neue Veranstaltung im Parkbad Gütersloh: ${input.title}`;

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://parkbad-gt.de';

  const eventLines = input.type === 'event' && input.eventDays
    ? input.eventDays
        .map(d => {
          if (!d.date) return '';
          const date = new Date(d.date).toLocaleDateString('de-DE', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
          });
          return `${date}, ${d.startTime ?? ''} - ${d.endTime ?? ''}`;
        })
        .filter(Boolean)
        .join('\n')
    : '';

  const text = [
    input.type === 'post' ? `Neue Neuigkeit: ${input.title}` : `Neue Veranstaltung: ${input.title}`,
    input.excerpt ?? '',
    eventLines,
    `Mehr erfahren: ${baseUrl}/${input.slug}`,
    '--',
    'Parkbad Gütersloh Newsletter',
  ].filter(Boolean).join('\n\n');

  return {
    from: 'Parkbad Gütersloh <newsletter@parkbad-gt.de>',
    audienceId: input.audienceId,
    subject,
    replyTo: 'verwaltung@parkbad-gt.de',
    html: input.htmlBody,
    text,
  };
}

export interface SendBroadcastResult {
  broadcastId: string;
  recipientCount: number;
}

export async function sendBroadcast(input: BroadcastInput): Promise<SendBroadcastResult> {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const payload = buildBroadcastPayload(input);

  const create = await resend.broadcasts.create(payload);
  if (create.error || !create.data?.id) {
    throw new Error(`Broadcast create failed: ${JSON.stringify(create.error)}`);
  }
  const broadcastId = create.data.id;

  const send = await resend.broadcasts.send(broadcastId);
  if (send.error) {
    throw new Error(`Broadcast send failed: ${JSON.stringify(send.error)}`);
  }

  let recipientCount = 0;
  try {
    const contacts = await resend.contacts.list({ audienceId: input.audienceId });
    // @ts-ignore - Resend SDK types are loose here
    const list = contacts.data?.data ?? [];
    recipientCount = list.filter((c: { unsubscribed?: boolean }) => !c.unsubscribed).length;
  } catch (err) {
    console.warn('Failed to fetch recipient count:', err);
  }

  return { broadcastId, recipientCount };
}
