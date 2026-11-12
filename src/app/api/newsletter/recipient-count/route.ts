import { NextResponse } from 'next/server';
import { getResend } from "@/lib/resend";


export async function GET() {
  const audienceId = process.env.RESEND_AUDIENCE_ID;
  if (!audienceId) {
    return NextResponse.json({ error: 'Audience not configured' }, { status: 500 });
  }
  try {
    const contacts = await getResend().contacts.list({ audienceId });
    // @ts-ignore - Resend SDK types are loose
    const list = contacts.data?.data ?? [];
    const count = list.filter((c: { unsubscribed?: boolean }) => !c.unsubscribed).length;
    return NextResponse.json({ count });
  } catch (err) {
    console.error('recipient-count error:', err);
    return NextResponse.json({ count: 0, error: 'Failed to fetch' }, { status: 500 });
  }
}
