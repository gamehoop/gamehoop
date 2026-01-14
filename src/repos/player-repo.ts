import { db } from '@/db';
import { Player } from '@/db/schema';
import { Selectable } from 'kysely';
import { BaseRepo } from './base-repo';

export class PlayerRepo extends BaseRepo<Player> {
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

export const playerRepo = new PlayerRepo();
