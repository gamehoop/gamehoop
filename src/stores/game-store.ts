import { db } from '@/db';
import { Game, InsertableGame, UpdateableGame } from '@/db/types';

export class GameStore {
  async getByIdForUser(
    gameId: number,
    userId: string,
  ): Promise<Game | undefined> {
    return db
      .selectFrom('game')
      .innerJoin('organization', 'organization.id', 'game.organizationId')
      .innerJoin('member', 'member.organizationId', 'organization.id')
      .innerJoin('user', 'user.id', 'member.userId')
      .where('game.id', '=', gameId)
      .where('user.id', '=', userId)
      .selectAll('game')
      .executeTakeFirst();
  }

  async getByOrganizationId(organizationId: string): Promise<Game[]> {
    return db
      .selectFrom('game')
      .where('organizationId', '=', organizationId)
      .selectAll()
      .execute();
  }

  async getByPublicId(publicId: string): Promise<Game | undefined> {
    return db
      .selectFrom('game')
      .where('publicId', '=', publicId)
      .selectAll()
      .executeTakeFirst();
  }

  async create(values: InsertableGame): Promise<Game> {
    return db
      .insertInto('game')
      .values(values)
      .returningAll()
      .executeTakeFirstOrThrow();
  }

  async update(gameId: number, values: UpdateableGame): Promise<Game> {
    return db
      .updateTable('game')
      .set({ ...values, updatedAt: new Date() })
      .where('id', '=', gameId)
      .returningAll()
      .executeTakeFirstOrThrow();
  }

  async deleteById(gameId: number): Promise<void> {
    await db.deleteFrom('game').where('id', '=', gameId).execute();
  }
}

export const gameStore = new GameStore();
