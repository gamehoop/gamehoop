import crypto from 'crypto';

export enum Scope {
  All = '*',
  ReadEvents = 'read:events',
  WriteEvents = 'write:events',
  ReadPlayers = 'read:players',
  WritePlayers = 'write:players',
}

export const scopeOptions = [
  {
    value: Scope.All,
    label: 'All',
  },
  {
    value: Scope.ReadEvents,
    label: 'Read Events',
  },
  {
    value: Scope.WriteEvents,
    label: 'Write Events',
  },
  {
    value: Scope.ReadPlayers,
    label: 'Read Players',
  },
  {
    value: Scope.WritePlayers,
    label: 'Write Players',
  },
];

export function generateApiKey(): string {
  return crypto.randomBytes(32).toString('hex');
}

export function hashApiKey(key: string): string {
  return crypto.createHash('sha256').update(key).digest('hex');
}
