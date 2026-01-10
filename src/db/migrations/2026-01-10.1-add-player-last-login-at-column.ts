import { Kysely } from 'kysely';
import { DB } from '../schema';

export async function up(db: Kysely<DB>): Promise<void> {
  await db.schema
    .alterTable('player')
    .addColumn('last_login_at', 'timestamptz')
    .execute();
}

export async function down(db: Kysely<DB>): Promise<void> {
  await db.schema.alterTable('player').dropColumn('last_login_at').execute();
}
