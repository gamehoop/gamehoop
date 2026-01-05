import { db } from '@/db';
import { GameApiKey } from '@/db/schema';
import { Selectable } from 'kysely';
import { BaseStore } from './base-store';

export class GameApiKeyStore extends BaseStore<GameApiKey> {
  constructor() {
    super('gameApiKey');
  }

  async findForGame(gamePublicId: string): Promise<Selectable<GameApiKey>[]> {
    return db
      .selectFrom('gameApiKey')
      .selectAll('gameApiKey')
      .innerJoin('game', 'game.id', 'gameApiKey.gameId')
      .where('game.publicId', '=', gamePublicId)
      .execute();
  }

  async findForGameAndUser(
    gameId: number,
    userId: string,
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

export const gameApiKeyStore = new GameApiKeyStore();
