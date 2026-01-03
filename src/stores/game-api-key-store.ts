import { db } from '@/db';
import { GameApiKey, InsertableGameApiKey } from '@/db/types';

export class GameApiKeyStore {
  async getById(gameApiKeyId: number): Promise<GameApiKey> {
    return db
      .selectFrom('gameApiKey')
      .where('id', '=', gameApiKeyId)
      .selectAll()
      .executeTakeFirstOrThrow();
  }

  async getByGameId(gameId: number): Promise<GameApiKey[]> {
    return db
      .selectFrom('gameApiKey')
      .where('gameId', '=', gameId)
      .selectAll()
      .execute();
  }

  async create(values: InsertableGameApiKey): Promise<GameApiKey> {
    return db
      .insertInto('gameApiKey')
      .values(values)
      .returningAll()
      .executeTakeFirstOrThrow();
  }

  async deleteById(gameApiKeyId: number): Promise<void> {
    await db.deleteFrom('gameApiKey').where('id', '=', gameApiKeyId).execute();
  }
}

export const gameApiKeyStore = new GameApiKeyStore();
