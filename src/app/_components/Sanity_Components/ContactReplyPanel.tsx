'use client';

import React, { useState } from 'react';
import { Button, Card, Stack, Text, TextArea, Box, Badge } from '@sanity/ui';
import { useFormValue, useCurrentUser } from 'sanity';

interface Reply {
  sentAt?: string;
  sentBy?: string;
  body?: string;
  resendEmailId?: string;
}

export default function ContactReplyPanel() {
  const documentId = useFormValue(['_id']) as string | undefined;
  const email = useFormValue(['email']) as string | undefined;
  const firstName = useFormValue(['firstName']) as string | undefined;
  const message = useFormValue(['message']) as string | undefined;
  const replies = (useFormValue(['replies']) as Reply[] | undefined) ?? [];

  const currentUser = useCurrentUser();

  const [body, setBody] = useState('');
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ tone: 'success' | 'critical'; text: string } | null>(null);

  const cleanDocId = documentId?.replace(/^drafts\./, '') ?? '';

  const handleSend = async () => {
    if (!body.trim()) return;
    setLoading(true);
    setFeedback(null);
    try {
      const sentBy = currentUser?.name ?? currentUser?.email ?? 'Studio';
      const res = await fetch('/api/contact/reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ submissionId: cleanDocId, body, sentBy }),
      });
      const data = await res.json();
      if (res.ok) {
        setFeedback({ tone: 'success', text: 'Antwort gesendet.' });
        setBody('');
      } else {
        setFeedback({ tone: 'critical', text: data.error ?? 'Fehler' });
      }
    } catch {
      setFeedback({ tone: 'critical', text: 'Netzwerkfehler.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Stack space={4}>
      <Card padding={4} radius={2} tone="transparent" border>
        <Stack space={2}>
          <Text size={1} weight="bold">Ursprüngliche Nachricht</Text>
          <Text size={2} style={{ whiteSpace: 'pre-wrap' }}>{message ?? ''}</Text>
        </Stack>
      </Card>

      {replies.length > 0 && (
        <Stack space={2}>
          <Text size={1} weight="bold">Bisherige Antworten</Text>
          {replies.map((r, i) => (
            <Card key={i} padding={3} radius={2} tone="primary" border>
              <Stack space={2}>
                <Box>
                  <Badge tone="primary">{r.sentBy ?? 'Studio'}</Badge>
                  <Text size={0} muted style={{ marginLeft: 8 }}>
                    {r.sentAt ? new Date(r.sentAt).toLocaleString('de-DE') : ''}
                  </Text>
                </Box>
                <Text size={2} style={{ whiteSpace: 'pre-wrap' }}>{r.body ?? ''}</Text>
              </Stack>
            </Card>
          ))}
        </Stack>
      )}

      <Card padding={4} radius={2} shadow={1}>
        <Stack space={3}>
          <Text size={1} weight="bold">Antworten an {firstName ?? email}</Text>
          <Text size={1} muted>
            Antworten Sie hier, damit das Gespräch dokumentiert ist. Die E-Mail wird von verwaltung@parkbad-gt.de gesendet und im Postfach des Empfängers korrekt im Thread angezeigt.
          </Text>
          <TextArea
            rows={6}
            placeholder="Ihre Antwort..."
            value={body}
            onChange={e => setBody(e.currentTarget.value)}
            disabled={loading}
          />
          <Button
            text={loading ? 'Wird gesendet...' : 'Senden als verwaltung@parkbad-gt.de'}
            tone="primary"
            disabled={loading || !body.trim()}
            loading={loading}
            onClick={handleSend}
          />
          {feedback && (
            <Box padding={2} style={{
              background: feedback.tone === 'success' ? '#d1fae5' : '#fee2e2',
              borderRadius: 4,
            }}>
              <Text size={1}>{feedback.text}</Text>
            </Box>
          )}
        </Stack>
      </Card>
    </Stack>
  );
}
