import { describe, expect, it } from 'vitest';
import { generateApiKey, hashApiKey } from '../game-api-key';

describe('generateApiKey/hashApiKey', () => {
  it('should generate a unique hash', () => {
    const apiKey1 = generateApiKey();
    const apiKey2 = generateApiKey();
    expect(apiKey1).not.toStrictEqual(apiKey2);
    expect(apiKey1.length).toBe(64);

    const hash1 = hashApiKey(apiKey1);
    const hash2 = hashApiKey(apiKey2);
    expect(hash1).not.toStrictEqual(hash2);

    expect(hash1).not.toStrictEqual(apiKey1);
    expect(hash2).not.toStrictEqual(apiKey2);
  });
});
