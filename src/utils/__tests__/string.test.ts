import { capitalize } from '@/utils/string';
import { describe, expect, test } from 'vitest';

describe('string utils', () => {
  test('capitalize', () => {
    expect(capitalize('foo')).toBe('Foo');
    expect(capitalize('bar baz')).toBe('Bar baz');
    expect(capitalize('')).toBe('');
  });
});
