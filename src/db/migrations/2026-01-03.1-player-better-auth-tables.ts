import { Kysely, sql } from 'kysely';
import { DB } from '../schema';

export async function up(db: Kysely<DB>): Promise<void> {
  await db.schema
    .createTable('player')
    .addColumn('id', 'text', (col) => col.notNull().primaryKey())
    .addColumn('name', 'text', (col) => col.notNull())
    .addColumn('email', 'text', (col) => col.notNull().unique())
    .addColumn('email_verified', 'boolean', (col) => col.notNull())
    .addColumn('image', 'text')
    .addColumn('is_anonymous', 'boolean')
    .addColumn('game_id', 'serial', (col) =>
      col.notNull().references('game.id').onDelete('cascade'),
    )
    .addColumn('created_at', 'timestamptz', (col) =>
      col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull(),
    )
    .addColumn('updated_at', 'timestamptz', (col) =>
      col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull(),
    )
    .execute();

  await db.schema
    .createIndex('idx_player_email')
    .on('player')
    .column('email')
    .execute();

  await db.schema
    .createIndex('idx_player_game_id')
    .on('player')
    .column('game_id')
    .execute();

  await db.schema
    .createIndex('uq_idx_player_email_game_id')
    .on('player')
    .columns(['email', 'game_id'])
    .unique()
    .execute();

  await db.schema
    .createTable('player_session')
    .addColumn('id', 'text', (col) => col.notNull().primaryKey())
    .addColumn('expires_at', 'timestamptz', (col) => col.notNull())
    .addColumn('token', 'text', (col) => col.notNull().unique())
    .addColumn('created_at', 'timestamptz', (col) =>
      col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull(),
    )
    .addColumn('updated_at', 'timestamptz', (col) => col.notNull())
    .addColumn('ip_address', 'text')
    .addColumn('user_agent', 'text')
    .addColumn('user_id', 'text', (col) =>
      col.notNull().references('player.id').onDelete('cascade'),
    )
    .addColumn('active_organization_id', 'text')
    .execute();

  await db.schema
    .createIndex('idx_player_session_user_id_token')
    .on('player_session')
    .columns(['user_id', 'token'])
    .execute();

  await db.schema
    .createTable('player_account')
    .addColumn('id', 'text', (col) => col.notNull().primaryKey())
    .addColumn('account_id', 'text', (col) => col.notNull())
    .addColumn('provider_id', 'text', (col) => col.notNull())
    .addColumn('user_id', 'text', (col) =>
      col.notNull().references('player.id').onDelete('cascade'),
    )
    .addColumn('access_token', 'text')
    .addColumn('refresh_token', 'text')
    .addColumn('id_token', 'text')
    .addColumn('access_token_expires_at', 'timestamptz')
    .addColumn('refresh_token_expires_at', 'timestamptz')
    .addColumn('scope', 'text')
    .addColumn('password', 'text')
    .addColumn('created_at', 'timestamptz', (col) =>
      col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull(),
    )
    .addColumn('updated_at', 'timestamptz', (col) => col.notNull())
    .execute();

  await db.schema
    .createIndex('idx_player_account_user_id')
    .on('player_account')
    .column('user_id')
    .execute();
}

export async function down(db: Kysely<DB>): Promise<void> {
  await db.schema.dropTable('player_account').ifExists().execute();
  await db.schema.dropTable('player_session').ifExists().execute();
  await db.schema.dropTable('player').ifExists().execute();
}
