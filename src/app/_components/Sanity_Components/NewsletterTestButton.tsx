// src/app/_components/Sanity_Components/NewsletterTestButton.tsx
'use client';

import React, { useState } from 'react';
import { Button, Stack, TextInput, Text, Card, Box } from '@sanity/ui';
import { useFormValue } from 'sanity/form';

interface NewsletterTestButtonProps {
  documentId?: string;
  value?: any;
  onChange?: (value: any) => void;
}

export default function NewsletterTestButton(props: NewsletterTestButtonProps) {
  // Get the current document from Sanity form context
  const document = useFormValue(['_id']) as string;
  const documentType = useFormValue(['_type']) as string;
  const title = useFormValue(['title']) as string | undefined;
  const eventTitle = useFormValue(['eventTitle']) as string | undefined;
  const [testEmail, setTestEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSendTest = async () => {
    if (!testEmail || !testEmail.includes('@')) {
      setMessage({ type: 'error', text: 'Bitte geben Sie eine gültige E-Mail-Adresse ein.' });
      return;
    }

    setLoading(true);
    setMessage(null);

    if (!document || !documentType) {
      setMessage({ type: 'error', text: 'Dokument-Informationen nicht verfügbar.' });
      setLoading(false);
      return;
    }

    try {
      const baseUrl = window.location.origin;
      const response = await fetch(`${baseUrl}/api/newsletter/test`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          documentId: document,
          documentType: documentType,
          testEmail: testEmail,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ 
          type: 'success', 
          text: `✅ Test-E-Mail erfolgreich an ${testEmail} gesendet!` 
        });
        // Clear email after successful send
        setTestEmail('');
      } else {
        setMessage({ 
          type: 'error', 
          text: `❌ Fehler: ${data.error || 'Unbekannter Fehler'}` 
        });
      }
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: `❌ Fehler beim Senden der Test-E-Mail` 
      });
    } finally {
      setLoading(false);
    }
  };

  const displayTitle = title || eventTitle || 'Unbenannt';
  const type = documentType === 'post' ? 'Beitrag' : 'Veranstaltung';

  return (
    <Card padding={4} radius={2} shadow={1} tone="default">
      <Stack space={4}>
        <Text size={1} weight="bold">
          Newsletter Test-E-Mail senden
        </Text>
        <Text size={1} muted>
          Testen Sie die Newsletter-E-Mail für diesen {type} bevor Sie sie an alle Abonnenten versenden.
        </Text>
        
        <Stack space={3}>
          <TextInput
            type="email"
            placeholder="test@example.com"
            value={testEmail}
            onChange={(event) => setTestEmail(event.currentTarget.value)}
            disabled={loading}
          />
          
          <Button
            text={loading ? 'Wird gesendet...' : 'Test-E-Mail senden'}
            tone="primary"
            onClick={handleSendTest}
            disabled={loading || !testEmail}
            loading={loading}
          />
        </Stack>

        {message && (
          <Box padding={2} style={{
            backgroundColor: message.type === 'success' ? '#d1fae5' : '#fee2e2',
            borderRadius: '4px',
            border: `1px solid ${message.type === 'success' ? '#10b981' : '#ef4444'}`,
          }}>
            <Text size={1} style={{ color: message.type === 'success' ? '#065f46' : '#991b1b' }}>
              {message.text}
            </Text>
          </Box>
        )}
      </Stack>
    </Card>
  );
}
