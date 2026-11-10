import { describe, expect, it } from 'vitest';
import sitemap from './sitemap';
import robots from './robots';
import { SITE_URL, absoluteUrl } from '@/lib/siteUrl';

describe('sitemap and robots', () => {
  it('lists only URLs on the canonical www origin', () => {
    for (const entry of sitemap()) {
      expect(entry.url.startsWith(`${SITE_URL}`)).toBe(true);
      expect(entry.url).not.toContain('guetersloh');
    }
  });

  it('never emits a raw ampersand, which is invalid inside <loc>', () => {
    for (const entry of sitemap()) expect(entry.url).not.toContain('&');
    expect(sitemap().map((e) => e.url)).toContain(`${SITE_URL}/Essen%26Trinken`);
  });

  it('lists the home page without a trailing slash', () => {
    expect(absoluteUrl('/')).toBe(SITE_URL);
  });

  it('points robots.txt at the sitemap on the same origin', () => {
    expect(robots().sitemap).toBe(`${SITE_URL}/sitemap.xml`);
  });
});
