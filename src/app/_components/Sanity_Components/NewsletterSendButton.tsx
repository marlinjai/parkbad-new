'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Button, Stack, Card, Text, Box, Dialog } from '@sanity/ui';
import { useFormValue, useClient } from 'sanity';
import { computeContentHash, extractHashableFields } from '@/lib/newsletter/contentHash';

interface NewsletterStatus {
  lastSentAt?: string;
  lastSentContentHash?: string;
  lastTestSentAt?: string;
  lastTestContentHash?: string;
}

export default function NewsletterSendButton() {
  const documentId = useFormValue(['_id']) as string | undefined;
  const documentType = useFormValue(['_type']) as string | undefined;
  const status = (useFormValue(['newsletterStatus']) as NewsletterStatus | undefined) ?? {};

  const eventTitle = useFormValue(['eventTitle']);
  const title = useFormValue(['title']);
  const excerpt = useFormValue(['excerpt']);
  const slug = useFormValue(['slug']);
  const coverImage = useFormValue(['coverImage']);
  const eventImage = useFormValue(['eventImage']);
  const eventDays = useFormValue(['eventDays']);

  const sanityClient = useClient({ apiVersion: '2024-01-01' });

  const [currentHash, setCurrentHash] = useState<string>('');
  const [recipientCount, setRecipientCount] = useState<number | null>(null);
  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ tone: 'success' | 'critical' | 'caution'; text: string } | null>(null);

  // Compute current content hash whenever relevant fields change
  useEffect(() => {
    if (!documentType) return;
    const hashable = extractHashableFields({
      _type: documentType as 'post' | 'customevent',
      eventTitle, title, excerpt,
      coverImage, eventImage,
      slug,
      eventDays,
    } as any);
    computeContentHash(hashable).then(setCurrentHash);
  }, [documentType, eventTitle, title, excerpt, slug, coverImage, eventImage, eventDays]);

  // Fetch recipient count once
  useEffect(() => {
    fetch('/api/newsletter/recipient-count')
      .then(r => r.json())
      .then(d => setRecipientCount(typeof d.count === 'number' ? d.count : null))
      .catch(() => setRecipientCount(null));
  }, []);

  const cleanDocId = documentId?.replace(/^drafts\./, '') ?? '';
  const cleanDocType = documentType ?? '';

  const buttonState = useMemo(() => {
    if (!status.lastTestSentAt) return 'locked-no-test';
    if (status.lastTestContentHash !== currentHash) return 'locked-stale';
    if (status.lastSentContentHash === currentHash) return 'already-sent';
    return 'armed';
  }, [status, currentHash]);

  const handleSend = async (force = false) => {
    setLoading(true);
    setMessage(null);
    try {
      const token = (sanityClient.config() as any).token;
      if (!token) {
        setMessage({ tone: 'critical', text: 'Sanity-Token nicht verfügbar. Bitte neu in Studio anmelden.' });
        setLoading(false);
        return;
      }
      const res = await fetch('/api/newsletter/send-now', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          documentId: cleanDocId,
          documentType: cleanDocType,
          expectedHash: currentHash,
          force,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage({ tone: 'success', text: `Newsletter an ${data.recipientCount} Abonnenten gesendet.` });
      } else {
        setMessage({ tone: 'critical', text: data.error ?? 'Unbekannter Fehler' });
      }
    } catch (e) {
      setMessage({ tone: 'critical', text: 'Netzwerkfehler beim Senden.' });
    } finally {
      setLoading(false);
      setConfirming(false);
    }
  };

  const buttonLabel = (() => {
    switch (buttonState) {
      case 'locked-no-test': return 'Bitte erst eine Test-E-Mail senden';
      case 'locked-stale': return 'Inhalt seit Test geändert, bitte erneut testen';
      case 'already-sent': return `Bereits versendet, erneut senden? (${recipientCount ?? '?'} Empfänger)`;
      case 'armed': return `An ca. ${recipientCount ?? '?'} Abonnenten senden`;
    }
  })();

  const buttonDisabled = buttonState === 'locked-no-test' || buttonState === 'locked-stale' || loading;
  const buttonTone = buttonState === 'already-sent' ? 'caution' : 'critical';

  return (
    <Card padding={4} radius={2} shadow={1}>
      <Stack space={3}>
        <Text size={1} weight="bold">Newsletter an Abonnenten senden</Text>
        <Text size={1} muted>
          Sendet den Newsletter an alle Newsletter-Abonnenten. Vorgang ist nicht widerrufbar.
        </Text>

        <Button
          text={buttonLabel}
          tone={buttonTone}
          mode="default"
          disabled={buttonDisabled}
          loading={loading}
          onClick={() => setConfirming(true)}
        />

        {message && (
          <Box padding={2} style={{
            background: message.tone === 'success' ? '#d1fae5' : message.tone === 'caution' ? '#fef3c7' : '#fee2e2',
            borderRadius: 4,
          }}>
            <Text size={1}>{message.text}</Text>
          </Box>
        )}

        {confirming && (
          <Dialog
            id="confirm-send"
            header="Newsletter senden?"
            onClose={() => setConfirming(false)}
            footer={
              <Box padding={3}>
                <Stack space={2}>
                  <Button
                    text={`Ja, jetzt an ${recipientCount ?? '?'} Empfänger senden`}
                    tone="critical"
                    onClick={() => handleSend(buttonState === 'already-sent')}
                    loading={loading}
                  />
                  <Button text="Abbrechen" mode="ghost" onClick={() => setConfirming(false)} />
                </Stack>
              </Box>
            }
          >
            <Box padding={4}>
              <Text>
                Der Newsletter wird an {recipientCount ?? '?'} Abonnenten gesendet. Vorgang ist nicht widerrufbar.
              </Text>
            </Box>
          </Dialog>
        )}
      </Stack>
    </Card>
  );
}
