// src/app/_components/Sanity_Components/NewsletterTestButton.tsx
'use client';

import React, { useState, useMemo, useSyncExternalStore } from 'react';
import { Button, Stack, TextInput, Text, Card, Box } from '@sanity/ui';

interface NewsletterTestButtonProps {
  documentId?: string;
  value?: any;
  onChange?: (value: any) => void;
}

// The pathname is read on every render; nothing needs to trigger a re-render on its own.
const subscribeToNothing = () => () => {};
const readPathname = () => window.location.pathname;
const readNoPathname = (): string | null => null;

export default function NewsletterTestButton(props: NewsletterTestButtonProps) {
  // Document ID and type come from the Studio URL (/admin/structure/{type};{id}).
  // Read through useSyncExternalStore so the server render (no window) and the
  // first client render agree, and no state is set inside an effect.
  const pathname = useSyncExternalStore(subscribeToNothing, readPathname, readNoPathname);
  const { documentId, documentType } = useMemo(() => {
    const match = pathname?.match(/\/structure\/(\w+);([^;]+)/);
    return match
      ? { documentId: match[2], documentType: match[1] }
      : { documentId: null, documentType: null };
  }, [pathname]);
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

    if (!documentId || !documentType) {
      setMessage({ type: 'error', text: 'Dokument-Informationen nicht verfügbar. Bitte speichern Sie das Dokument zuerst, bevor Sie eine Test-E-Mail senden.' });
      setLoading(false);
      return;
    }

    // Validate document type
    if (documentType !== 'post' && documentType !== 'customevent') {
      setMessage({ type: 'error', text: 'Test-E-Mail ist nur für Beiträge und Veranstaltungen verfügbar.' });
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
          documentId: documentId,
          documentType: documentType as 'post' | 'customevent',
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

  const type = documentType === 'post' ? 'Beitrag' : 'Veranstaltung';

  return (
    <Card padding={4} radius={2} shadow={1} tone="default">
      <Stack gap={4}>
        <Text size={1} weight="bold">
          Newsletter Test-E-Mail senden
        </Text>
        <Text size={1} muted>
          Testen Sie die Newsletter-E-Mail für diesen {type} bevor Sie sie an alle Abonnenten versenden.
        </Text>
        
        <Stack gap={3}>
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
