import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { render } from '@react-email/render';
import React from 'react';
import { writeClient } from '../../../../sanity/lib/sanity.write';
import { ContactReplyTemplate } from '../../../_components/email_templates/contact-reply-template';

const resend = new Resend(process.env.RESEND_API_KEY);

interface ReplyRequest {
  submissionId: string;
  body: string;
  sentBy?: string;
}

interface SubmissionDoc {
  _id?: string;
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

    // Fetch both the published doc and any draft so we can patch both
    // and use the draft state (what the editor sees) as the source of truth
    // for the existing replies array.
    const draftId = `drafts.${submissionId}`;
    const [publishedDoc, draftDoc] = await Promise.all([
      writeClient.getDocument<SubmissionDoc>(submissionId),
      writeClient.getDocument<SubmissionDoc>(draftId),
    ]);

    const sourceDoc = draftDoc ?? publishedDoc;
    if (!sourceDoc?.email) {
      return NextResponse.json({ error: 'Submission not found or missing email' }, { status: 404 });
    }

    const headers: Record<string, string> = {
      'X-Mailer': 'Parkbad Gütersloh Contact Reply',
    };
    if (sourceDoc.originalMessageId) {
      headers['In-Reply-To'] = sourceDoc.originalMessageId;
      headers['References'] = sourceDoc.originalMessageId;
    }

    const html = await render(
      React.createElement(ContactReplyTemplate, {
        firstName: sourceDoc.firstName,
        body,
      })
    );

    const send = await resend.emails.send({
      from: 'Parkbad Gütersloh <verwaltung@parkbad-gt.de>',
      to: [sourceDoc.email],
      replyTo: 'verwaltung@parkbad-gt.de',
      subject: 'Re: Ihre Anfrage an Parkbad Gütersloh',
      headers,
      html,
      text: `Hallo ${sourceDoc.firstName ?? ''},\n\n${body}\n\nMit freundlichen Grüßen\nIhr Team vom Parkbad Gütersloh`,
    });

    if (send.error) {
      return NextResponse.json({ error: 'Failed to send reply', details: send.error }, { status: 500 });
    }

    const replyEntry = {
      _key: (send.data?.id ?? Date.now().toString()).replace(/[^a-zA-Z0-9]/g, '').slice(0, 32),
      sentAt: new Date().toISOString(),
      sentBy: userName,
      body,
      resendEmailId: send.data?.id ?? '',
    };

    const newReplies = (sourceDoc.replies ?? []).concat([replyEntry]);
    const newStatus = sourceDoc.status === 'offen' ? 'inBearbeitung' : sourceDoc.status;

    // Patch both versions so the reply shows up regardless of whether the
    // editor is viewing the draft or the published doc, and persists when
    // the draft is published or discarded.
    const tx = writeClient.transaction()
      .patch(submissionId, p => p.set({ replies: newReplies, status: newStatus }));
    if (draftDoc) {
      tx.patch(draftId, p => p.set({ replies: newReplies, status: newStatus }));
    }
    await tx.commit();

    return NextResponse.json({ success: true, emailId: send.data?.id });
  } catch (err) {
    console.error('contact reply error:', err);
    return NextResponse.json({
      error: 'Failed to send reply',
      details: err instanceof Error ? err.message : String(err),
    }, { status: 500 });
  }
}
