import { Kysely } from 'kysely';
import { DB } from '../schema';

export async function up(db: Kysely<DB>): Promise<void> {
  await db.schema.alterTable('game').addColumn('settings', 'json').execute();
}

export async function down(db: Kysely<DB>): Promise<void> {
  await db.schema.alterTable('game').dropColumn('game').execute();
}
