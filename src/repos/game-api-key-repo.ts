import { db } from '@/db';
import { GameApiKey } from '@/db/schema';
import { Selectable } from 'kysely';
import { BaseRepo } from './base-repo';

export class GameApiKeyRepo extends BaseRepo<GameApiKey> {
  constructor() {
    super('gameApiKey');
  }

  async findOneForGame({
    gameId,
    keyHash,
  }: {
    gameId: string;
    keyHash: string;
  }): Promise<Selectable<GameApiKey> | undefined> {
    return db
      .selectFrom('gameApiKey')
      .selectAll('gameApiKey')
      .innerJoin('game', 'game.id', 'gameApiKey.gameId')
      .where('game.id', '=', gameId)
      .where('gameApiKey.active', '=', true)
      .where('gameApiKey.keyHash', '=', keyHash)
      .executeTakeFirst();
  }

  async findManyForUserAndGame(
    userId: string,
    gameId: string,
  ): Promise<Selectable<GameApiKey>[]> {
    return db
      .selectFrom('gameApiKey')
      .selectAll('gameApiKey')
      .innerJoin('game', 'game.id', 'gameApiKey.gameId')
      .innerJoin('organization', 'organization.id', 'game.organizationId')
      .innerJoin('member', 'member.organizationId', 'organization.id')
      .innerJoin('user', 'user.id', 'member.userId')
      .where('user.id', '=', userId)
      .where('game.id', '=', gameId)
      .execute();
  }
}

export const gameApiKeyRepo = new GameApiKeyRepo();
