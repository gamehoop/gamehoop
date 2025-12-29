import { Kysely } from 'kysely';
import { DB } from '../schema';

export async function up(db: Kysely<DB>): Promise<void> {
  await db.schema.alterTable('user').addColumn('settings', 'text').execute();

  await db.schema.alterTable('user').dropColumn('dark_mode').execute();
}

export async function down(db: Kysely<DB>): Promise<void> {
  await db.schema
    .alterTable('user')
    .addColumn('dark_mode', 'boolean')
    .execute();

  await db.schema.alterTable('user').dropColumn('settings').execute();
}
