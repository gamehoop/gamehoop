import { db } from '@/db';
import { Player } from '@/db/schema';
import { Selectable } from 'kysely';
import { BaseStore } from './base-store';

export class PlayerStore extends BaseStore<Player> {
  constructor() {
    super('player');
  }

  async findOneForSession(
    token: string,
  ): Promise<Selectable<Player> | undefined> {
    return db
      .selectFrom('player')
      .innerJoin('playerSession', 'player.id', 'playerSession.userId')
      .where('playerSession.token', '=', token)
      .selectAll('player')
      .executeTakeFirst();
  }
}

export const playerStore = new PlayerStore();
