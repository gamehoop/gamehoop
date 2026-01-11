import { db } from '@/db';
import { Game } from '@/db/schema';
import { Selectable } from 'kysely';
import { BaseStore } from './base-store';

export class GameStore extends BaseStore<Game> {
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

    if (args.where?.publicId) {
      query = query.where('game.publicId', '=', args.where.publicId);
    }

    return query.executeTakeFirst();
  }
}

export const gameStore = new GameStore();
