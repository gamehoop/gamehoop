import { Kysely } from 'kysely';
import { DB } from '../schema';

export async function up(db: Kysely<DB>): Promise<void> {
  await db.schema
    .createIndex('uq_idx_game_public_id')
    .on('game')
    .column('publicId')
    .unique()
    .execute();
}

export async function down(db: Kysely<DB>): Promise<void> {
  await db.schema
    .alterTable('game')
    .dropIndex('uq_idx_game_public_id')
    .execute();
}
