import { Insertable, Selectable, Updateable } from 'kysely';
import { GameApiKey as GameApiKeyTable, Game as GameTable } from './schema';

export type Game = Selectable<GameTable>;
export type InsertableGame = Insertable<GameTable>;
export type UpdateableGame = Updateable<GameTable>;

export type GameApiKey = Selectable<GameApiKeyTable>;
export type InsertableGameApiKey = Insertable<GameApiKeyTable>;
