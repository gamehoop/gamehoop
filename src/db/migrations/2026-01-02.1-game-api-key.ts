import { Kysely, sql } from 'kysely';
import { DB } from '../schema';

export async function up(db: Kysely<DB>): Promise<void> {
  await db.schema
    .createTable('game_api_key')
    .addColumn('id', 'serial', (col) => col.notNull().primaryKey())
    .addColumn('game_id', 'serial', (col) =>
      col.notNull().references('game.id').onDelete('cascade'),
    )
    .addColumn('key_hash', 'char(64)', (col) => col.notNull().unique())
    .addColumn('scopes', sql`text[]`, (col) =>
      col.notNull().defaultTo(sql`'{}'`),
    )
    .addColumn('created_at', 'timestamptz', (col) =>
      col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull(),
    )
    .addColumn('created_by', 'text', (col) =>
      col.notNull().references('user.id'),
    )
    .addColumn('active', 'boolean', (col) => col.notNull().defaultTo(true))
    .addColumn('last_used_at', 'timestamptz')
    .addColumn('expires_at', 'timestamptz')
    .addColumn('description', 'text')
    .execute();

  await db.schema
    .createIndex('idx_game_api_key_game_id_active_key_hash')
    .on('game_api_key')
    .columns(['game_id', 'active', 'key_hash'])
    .execute();

  await db.schema
    .alterTable('game')
    .addColumn('public_id', 'text', (col) =>
      col.notNull().defaultTo(sql`gen_random_uuid()`),
    )
    .execute();
}

export async function down(db: Kysely<DB>): Promise<void> {
  await db.schema.alterTable('game').dropColumn('public_id').execute();
  await db.schema.dropTable('game_api_key').ifExists().execute();
}
