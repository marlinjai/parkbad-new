import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { writeClient } from '../../../../sanity/lib/sanity.write';
import { sanityFetch } from '../../../../sanity/lib/sanity.fetch';

const resend = new Resend(process.env.RESEND_API_KEY);

interface ReplyRequest {
  submissionId: string;
  body: string;
  sentBy?: string;
}

interface SubmissionDoc {
  email?: string;
  firstName?: string;
  lastName?: string;
  originalMessageId?: string;
  status?: string;
  replies?: Array<unknown>;
}

export async function POST(request: NextRequest) {
  try {
    const { submissionId, body, sentBy } = await request.json() as ReplyRequest;
    if (!submissionId || !body?.trim()) {
      return NextResponse.json({ error: 'Missing submissionId or body' }, { status: 400 });
    }
    const userName = sentBy?.trim() || 'Studio';

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
