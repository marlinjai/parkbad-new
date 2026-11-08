// Renders every email template the API routes send through @react-email/render,
// the same way the routes do (render(React.createElement(...))). Guards the
// react-email upgrade: a template that no longer renders, or renders without its
// content, fails here instead of in a customer's inbox.
import React from 'react';
import { render } from '@react-email/render';
import { describe, expect, it } from 'vitest';

import { ContactAutoReplyTemplate } from './contact-autoreply-template';
import { ContactReplyTemplate } from './contact-reply-template';
import { NewsletterTemplate } from './newsletter-template';
import { WelcomeTemplate } from './welcome-template';

const expectEmailDocument = (html: string) => {
  expect(html.startsWith('<!DOCTYPE html')).toBe(true);
  expect(html).toContain('</html>');
};

describe('email templates render with @react-email/render', () => {
  it('renders the welcome email with the confirmation link', async () => {
    const confirmationUrl =
      'https://parkbad-gt.de/api/newsletter/confirm?token=abc123&email=max%40example.com';
    const html = await render(
      React.createElement(WelcomeTemplate, { confirmationUrl, email: 'max@example.com' })
    );
    expectEmailDocument(html);
    expect(html).toContain('href="https://parkbad-gt.de/api/newsletter/confirm?token=abc123&amp;email=max%40example.com"');
    expect(html).toContain('max@example.com');
  });

  it('renders the contact auto-reply in both opening states', async () => {
    const open = await render(
      React.createElement(ContactAutoReplyTemplate, {
        firstName: 'Anna',
        lastName: 'Schmidt',
        isOpen: true,
        normalMessage: 'Wir melden uns schnellstmöglich.',
      })
    );
    const closed = await render(
      React.createElement(ContactAutoReplyTemplate, {
        firstName: 'Max',
        lastName: 'Mustermann',
        isOpen: false,
        winterBreakMessage: 'Winterpause bis März.',
      })
    );
    expectEmailDocument(open);
    expectEmailDocument(closed);
    expect(open).toContain('Wir melden uns schnellstmöglich.');
    expect(closed).toContain('Winterpause bis März.');
  });

  it('renders the contact reply with the reply body', async () => {
    const html = await render(
      React.createElement(ContactReplyTemplate, {
        firstName: 'Anna',
        body: 'Vielen Dank für Ihre Nachricht.',
      })
    );
    expectEmailDocument(html);
    expect(html).toContain('Vielen Dank für Ihre Nachricht.');
  });

  it('renders the newsletter with title, image and post link', async () => {
    const html = await render(
      React.createElement(NewsletterTemplate, {
        type: 'post',
        title: 'Sommerfest im Parkbad',
        excerpt: 'Alle Infos zum Fest.',
        imageUrl: 'https://cdn.sanity.io/images/example.jpg',
        slug: 'sommerfest',
      })
    );
    expectEmailDocument(html);
    expect(html).toContain('Sommerfest im Parkbad');
    expect(html).toContain('src="https://cdn.sanity.io/images/example.jpg"');
    expect(html).toMatch(/href="https?:\/\/[^"]+\/sommerfest"/);
  });
});
