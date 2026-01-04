import { db } from '@/db';
import { GameApiKey, InsertableGameApiKey } from '@/db/types';

export class GameApiKeyStore {
  async getByIdForUser(
    gameApiKeyId: number,
    userId: string,
  ): Promise<GameApiKey | undefined> {
    return db
      .selectFrom('gameApiKey')
      .innerJoin('game', 'game.id', 'gameApiKey.gameId')
      .innerJoin('organization', 'organization.id', 'game.organizationId')
      .innerJoin('member', 'member.organizationId', 'organization.id')
      .innerJoin('user', 'user.id', 'member.userId')
      .where('user.id', '=', userId)
      .where('gameApiKey.id', '=', gameApiKeyId)
      .selectAll('gameApiKey')
      .executeTakeFirst();
  }

  async getByGamePublicId(publicId: string): Promise<GameApiKey[]> {
    return db
      .selectFrom('gameApiKey')
      .innerJoin('game', 'game.id', 'gameApiKey.gameId')
      .where('game.publicId', '=', publicId)
      .selectAll('gameApiKey')
      .execute();
  }

  async getByGameIdForUser(
    gameId: number,
    userId: string,
  ): Promise<GameApiKey[]> {
    return db
      .selectFrom('gameApiKey')
      .innerJoin('game', 'game.id', 'gameApiKey.gameId')
      .innerJoin('organization', 'organization.id', 'game.organizationId')
      .innerJoin('member', 'member.organizationId', 'organization.id')
      .innerJoin('user', 'user.id', 'member.userId')
      .where('user.id', '=', userId)
      .where('game.id', '=', gameId)
      .selectAll('gameApiKey')
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
