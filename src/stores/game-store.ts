import { db } from '@/db';
import { Game, InsertableGame, UpdateableGame } from '@/db/types';

export class GameStore {
  async create(values: InsertableGame): Promise<Game> {
    return db
      .insertInto('game')
      .values(values)
      .returningAll()
      .executeTakeFirstOrThrow();
  }

  async update(gameId: number, values: UpdateableGame): Promise<Game> {
    return db
      .updateTable('game')
      .set({ ...values, updatedAt: new Date() })
      .where('id', '=', gameId)
      .returningAll()
      .executeTakeFirstOrThrow();
  }

  async deleteById(gameId: number): Promise<void> {
    await db.deleteFrom('game').where('id', '=', gameId).execute();
  }
}

export const gameStore = new GameStore();
