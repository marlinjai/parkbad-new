import { describe, it, expect, vi, beforeEach } from 'vitest';
import { buildBroadcastPayload } from './sendBroadcast';

describe('buildBroadcastPayload', () => {
  beforeEach(() => {
    vi.stubEnv('NEXT_PUBLIC_BASE_URL', 'https://parkbad-gt.de');
  });

  it('builds a post broadcast payload', () => {
    const payload = buildBroadcastPayload({
      type: 'post',
      title: 'Hello',
      excerpt: 'world',
      slug: 'hello-world',
      audienceId: 'aud_123',
      htmlBody: '<p>hi</p>',
    });
    expect(payload.subject).toBe('Parkbad Gütersloh: Hello');
    expect(payload.audienceId).toBe('aud_123');
    expect(payload.from).toBe('Parkbad Gütersloh <newsletter@parkbad-gt.de>');
    expect(payload.text).toContain('Hello');
    expect(payload.text).toContain('https://parkbad-gt.de/hello-world');
  });

  it('builds an event broadcast payload with event days', () => {
    const payload = buildBroadcastPayload({
      type: 'event',
      title: 'Saisonöffnung',
      slug: 'saisonoeffnung',
      audienceId: 'aud_123',
      htmlBody: '<p>hi</p>',
      eventDays: [
        { date: '2026-05-01', startTime: '15:00', endTime: '20:00' },
      ],
    });
    expect(payload.subject).toBe('Neue Veranstaltung im Parkbad Gütersloh: Saisonöffnung');
    expect(payload.text).toMatch(/01\.05\.2026/);
    expect(payload.text).toMatch(/15:00 - 20:00/);
  });
});
