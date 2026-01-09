import { describe, expect, it } from 'vitest';
import { generateApiKey, hashApiKey } from '../game-api-key';

describe('generateApiKey/hashApiKey', () => {
  it('should generate a unique hash', () => {
    const apiKey1 = generateApiKey();
    const apiKey2 = generateApiKey();
    expect(apiKey1).not.toEqual(apiKey2);
    expect(apiKey1.length).toBe(64);

    const hash1 = hashApiKey(apiKey1);
    const hash2 = hashApiKey(apiKey2);
    expect(hash1).not.toEqual(hash2);

    expect(hash1).not.toEqual(apiKey1);
    expect(hash2).not.toEqual(apiKey2);
  });
});
