import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { createClient } from 'next-sanity';
import { writeClient } from '../../../../sanity/lib/sanity.write';
import { sanityFetch } from '../../../../sanity/lib/sanity.fetch';
import { apiVersion, dataset, projectId } from '../../../../sanity/env';

const resend = new Resend(process.env.RESEND_API_KEY);

interface ReplyRequest {
  submissionId: string;
  body: string;
}

interface SubmissionDoc {
  email?: string;
  firstName?: string;
  lastName?: string;
  originalMessageId?: string;
  status?: string;
  replies?: Array<unknown>;
}

async function validateSanityToken(token: string): Promise<{ ok: boolean; userName?: string }> {
  try {
    const userClient = createClient({ apiVersion, dataset, projectId, token, useCdn: false });
    const me = await userClient.users.getById('me') as { name?: string; displayName?: string; email?: string };
    return { ok: true, userName: me.displayName ?? me.name ?? me.email ?? 'Studio' };
  } catch {
    return { ok: false };
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = request.headers.get('authorization') ?? '';
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';
    if (!token) return NextResponse.json({ error: 'Missing Authorization' }, { status: 401 });

    const { ok, userName } = await validateSanityToken(token);
    if (!ok) return NextResponse.json({ error: 'Invalid Sanity token' }, { status: 401 });

    const { submissionId, body } = await request.json() as ReplyRequest;
    if (!submissionId || !body?.trim()) {
      return NextResponse.json({ error: 'Missing submissionId or body' }, { status: 400 });
    }

    const submission = await sanityFetch<SubmissionDoc>({
      query: `*[_type == "contactSubmission" && _id == $id][0]{ email, firstName, lastName, originalMessageId, status, replies }`,
      params: { id: submissionId },
    });

    if (!submission?.email) {
      return NextResponse.json({ error: 'Submission not found or missing email' }, { status: 404 });
    }

    const headers: Record<string, string> = {
      'X-Mailer': 'Parkbad Gütersloh Contact Reply',
    };
    if (submission.originalMessageId) {
      headers['In-Reply-To'] = submission.originalMessageId;
      headers['References'] = submission.originalMessageId;
    }

    const send = await resend.emails.send({
      from: 'Parkbad Gütersloh <verwaltung@parkbad-gt.de>',
      to: [submission.email],
      replyTo: 'verwaltung@parkbad-gt.de',
      subject: 'Re: Ihre Anfrage an Parkbad Gütersloh',
      headers,
      text: `Hallo ${submission.firstName ?? ''},\n\n${body}\n\nMit freundlichen Grüßen\nIhr Team vom Parkbad Gütersloh`,
    });

    if (send.error) {
      return NextResponse.json({ error: 'Failed to send reply', details: send.error }, { status: 500 });
    }

    const replyEntry = {
      sentAt: new Date().toISOString(),
      sentBy: userName ?? 'Studio',
      body,
      resendEmailId: send.data?.id ?? '',
    };

    const newReplies = (submission.replies ?? []).concat([replyEntry]);
    const newStatus = submission.status === 'offen' ? 'inBearbeitung' : submission.status;

    await writeClient.patch(submissionId).set({
      replies: newReplies,
      status: newStatus,
    }).commit();

    return NextResponse.json({ success: true, emailId: send.data?.id });
  } catch (err) {
    console.error('contact reply error:', err);
    return NextResponse.json({
      error: 'Failed to send reply',
      details: err instanceof Error ? err.message : String(err),
    }, { status: 500 });
  }
}
