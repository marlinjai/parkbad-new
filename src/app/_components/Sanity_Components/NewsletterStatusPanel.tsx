'use client';

import React from 'react';
import { Card, Stack, Text, Badge, Box } from '@sanity/ui';
import type { ObjectInputProps } from 'sanity';

interface SendHistoryEntry {
  sentAt?: string;
  trigger?: string;
  broadcastId?: string;
  recipientCount?: number;
}

interface NewsletterStatusValue {
  lastSentAt?: string;
  lastSentTrigger?: string;
  lastSentBroadcastId?: string;
  lastSentRecipientCount?: number;
  lastTestSentAt?: string;
  lastTestContentHash?: string;
  lastSentContentHash?: string;
  sendHistory?: SendHistoryEntry[];
}

function formatDateTime(iso?: string): string {
  if (!iso) return '';
  const d = new Date(iso);
  return d.toLocaleString('de-DE', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

export default function NewsletterStatusPanel(props: ObjectInputProps<NewsletterStatusValue>) {
  const value = props.value ?? {};
  const hasBeenSent = Boolean(value.lastSentAt);

  return (
    <Card padding={4} radius={2} shadow={1} tone={hasBeenSent ? 'positive' : 'transparent'}>
      <Stack space={3}>
        <Text size={1} weight="bold">Newsletter Status</Text>

        {hasBeenSent ? (
          <Stack space={2}>
            <Text size={2}>
              Versendet am <strong>{formatDateTime(value.lastSentAt)}</strong> an{' '}
              <strong>{value.lastSentRecipientCount ?? '?'}</strong> Abonnenten
            </Text>
            <Box>
              <Badge tone="primary">{value.lastSentTrigger === 'manual' ? 'manuell' : (value.lastSentTrigger ?? 'unbekannt')}</Badge>
              {value.lastSentBroadcastId && (
                <Text size={0} muted style={{ marginLeft: 8 }}>
                  Broadcast: {value.lastSentBroadcastId}
                </Text>
              )}
            </Box>
          </Stack>
        ) : (
          <Text size={2} muted>Newsletter noch nicht versendet</Text>
        )}

        {value.lastTestSentAt && (
          <Text size={1} muted>
            Letzter Test: {formatDateTime(value.lastTestSentAt)}
          </Text>
        )}

        {value.sendHistory && value.sendHistory.length > 1 && (
          <details>
            <summary style={{ cursor: 'pointer', fontSize: 12, color: '#666' }}>
              Verlauf anzeigen ({value.sendHistory.length} Einträge)
            </summary>
            <Stack space={2} marginTop={2}>
              {value.sendHistory.map((entry, i) => (
                <Card key={i} padding={2} radius={1} tone="transparent" border>
                  <Text size={1}>
                    {formatDateTime(entry.sentAt)}, {entry.recipientCount ?? '?'} Empfänger ({entry.trigger ?? 'unbekannt'})
                  </Text>
                </Card>
              ))}
            </Stack>
          </details>
        )}
      </Stack>
    </Card>
  );
}
