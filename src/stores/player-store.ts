import { db } from '@/db';
import { Player } from '@/db/types';

export class PlayerStore {
  async getById(playerId: string, gameId: number): Promise<Player | undefined> {
    return db
      .selectFrom('player')
      .where('gameId', '=', gameId)
      .where('id', '=', playerId)
      .selectAll()
      .executeTakeFirst();
  }
}

export const playerStore = new PlayerStore();
