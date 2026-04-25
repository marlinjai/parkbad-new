import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function GET() {
  const audienceId = process.env.RESEND_AUDIENCE_ID;
  if (!audienceId) {
    return NextResponse.json({ error: 'Audience not configured' }, { status: 500 });
  }
  try {
    const contacts = await resend.contacts.list({ audienceId });
    // @ts-ignore - Resend SDK types are loose
    const list = contacts.data?.data ?? [];
    const count = list.filter((c: { unsubscribed?: boolean }) => !c.unsubscribed).length;
    return NextResponse.json({ count });
  } catch (err) {
    console.error('recipient-count error:', err);
    return NextResponse.json({ count: 0, error: 'Failed to fetch' }, { status: 500 });
  }
}
