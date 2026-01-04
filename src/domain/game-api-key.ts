import crypto from 'crypto';

export enum Scope {
  All = '*',
}

export const scopeOptions = [
  {
    value: Scope.All,
    label: 'All',
  },
];

export function generateApiKey(): string {
  return crypto.randomBytes(32).toString('hex');
}

export function hashApiKey(key: string): string {
  return crypto.createHash('sha256').update(key).digest('hex');
}
