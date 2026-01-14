import { db } from '@/db';
import { Game } from '@/db/schema';
import { Selectable } from 'kysely';
import { BaseRepo } from './base-repo';

export class GameRepo extends BaseRepo<Game> {
  constructor() {
    super('game');
  }

  async findOneForUser(args: {
    userId: string;
    where?: Partial<Selectable<Game>>;
  }): Promise<Promise<Selectable<Game> | undefined>> {
    let query = db
      .selectFrom('game')
      .selectAll('game')
      .innerJoin('organization', 'organization.id', 'game.organizationId')
      .innerJoin('member', 'member.organizationId', 'organization.id')
      .innerJoin('user', 'user.id', 'member.userId')
      .where('user.id', '=', args.userId);

    if (args.where?.id) {
      query = query.where('game.id', '=', args.where.id);
    }

    return query.executeTakeFirst();
  }
}

export const gameRepo = new GameRepo();
