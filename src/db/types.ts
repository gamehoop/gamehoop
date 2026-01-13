import { Insertable, Selectable, Updateable } from 'kysely';
import {
  GameApiKey as GameApiKeyTable,
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

export type Player = Selectable<PlayerTable>;
export type PlayerSession = Selectable<PlayerSessionTable>;
export type UpdateablePlayerSession = Updateable<PlayerSessionTable>;
