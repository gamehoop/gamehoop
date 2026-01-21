import { Insertable, Selectable, Updateable } from 'kysely';
import {
  GameApiKey as GameApiKeyTable,
  GameEvent as GameEventTable,
  Game as GameTable,
  PlayerSession as PlayerSessionTable,
  Player as PlayerTable,
} from './schema';

export interface GameAuthSettings {
  requireEmailVerification?: boolean;
  minPasswordLength?: number;
  sessionExpiresInDays?: number;
  senderName?: string;
  replyToEmail?: string;
}

export interface GameSettings {
  auth?: GameAuthSettings;
}

export type Game = Selectable<GameTable> & { settings: GameSettings | null };
export type InsertableGame = Insertable<GameTable>;
export type UpdateableGame = Updateable<GameTable>;

export type GameApiKey = Selectable<GameApiKeyTable>;
export type InsertableGameApiKey = Insertable<GameApiKeyTable>;

export type GameEvent = Selectable<GameEventTable>;
export type InsertableGameEvent = Insertable<GameEventTable>;

export type Player = Selectable<PlayerTable>;
export type UpdatablePlayer = Updateable<PlayerTable>;

export type PlayerSession = Selectable<PlayerSessionTable>;
export type UpdateablePlayerSession = Updateable<PlayerSessionTable>;
