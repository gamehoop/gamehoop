import { db } from '@/db';
import { PlayerSession } from '@/db/types';

export class PlayerSessionStore {
  async listForGame(gameId: number): Promise<PlayerSession[]> {
    return db
      .selectFrom('playerSession')
      .innerJoin('player', 'player.id', 'userId')
      .where('player.gameId', '=', gameId)
      .selectAll('playerSession')
      .execute();
  }

  async getByPlayerId(playerId: string): Promise<PlayerSession[]> {
    return db
      .selectFrom('playerSession')
      .where('playerSession.userId', '=', playerId)
      .selectAll()
      .execute();
  }

  async deleteByPlayerId(playerId: string): Promise<void> {
    await db
      .deleteFrom('playerSession')
      .where('playerSession.userId', '=', playerId)
      .execute();
  }

  async deleteById(id: string): Promise<void> {
    await db
      .deleteFrom('playerSession')
      .where('playerSession.id', '=', id)
      .execute();
  }
}

export const playerSessionStore = new PlayerSessionStore();
