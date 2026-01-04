import { db } from '@/db';
import { PlayerSession } from '@/db/types';

export class PlayerSessionStore {
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
}

export const playerSessionStore = new PlayerSessionStore();
