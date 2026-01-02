import { Insertable, Selectable, Updateable } from 'kysely';
import { Game as GameTable } from './schema';

export type Game = Selectable<GameTable>;
export type InsertableGame = Insertable<GameTable>;
export type UpdateableGame = Updateable<GameTable>;
