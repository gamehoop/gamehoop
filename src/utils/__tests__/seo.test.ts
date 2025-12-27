import { seo } from '@/utils/seo';
import { describe, expect, test } from 'vitest';

describe('seo', () => {
  test('returns an array of metadata', () => {
    expect(seo({ title: 'My Title', description: 'My Description' })).toEqual([
      { title: 'My Title' },
      { name: 'description', content: 'My Description' },
      { name: 'og:type', content: 'website' },
      { name: 'og:title', content: 'My Title' },
      { name: 'og:description', content: 'My Description' },
    ]);
  });
});
