import { Kysely, sql } from 'kysely';
import { DB } from '../schema';

export async function up(db: Kysely<DB>): Promise<void> {
  await db.schema
    .createTable('game_event')
    .addColumn('id', 'text', (col) =>
      col
        .notNull()
        .primaryKey()
        .defaultTo(sql`uuidv7()`),
    )
    .addColumn('game_id', 'text', (col) =>
      col.notNull().references('game.id').onDelete('cascade'),
    )
    .addColumn('player_id', 'text', (col) =>
      col.references('player.id').onDelete('cascade'),
    )
    .addColumn('name', 'text', (col) => col.notNull())
    .addColumn('timestamp', 'timestamptz', (col) => col.notNull())
    .addColumn('properties', 'jsonb')
    .addColumn('session_id', 'text')
    .addColumn('device_id', 'text')
    .addColumn('created_at', 'timestamptz', (col) =>
      col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull(),
    )
    .execute();

  await db.schema
    .createIndex('idx_game_event_game_id')
    .on('game_event')
    .column('game_id')
    .execute();

  await db.schema
    .createIndex('idx_game_event_player_id')
    .on('game_event')
    .column('player_id')
    .execute();

  await db.schema
    .createIndex('idx_game_event_name')
    .on('game_event')
    .column('name')
    .execute();

  await db.schema
    .createIndex('idx_game_event_timestamp')
    .on('game_event')
    .column('timestamp')
    .execute();

  await db.schema
    .createIndex('idx_game_event_session_id')
    .on('game_event')
    .column('session_id')
    .execute();

  await db.schema
    .createIndex('idx_game_event_game_timestamp')
    .on('game_event')
    .columns(['game_id', 'timestamp'])
    .execute();

  await db.schema
    .createIndex('idx_game_event_player_timestamp')
    .on('game_event')
    .columns(['player_id', 'timestamp'])
    .execute();

  await db.schema
    .createIndex('idx_game_event_game_name_timestamp')
    .on('game_event')
    .columns(['game_id', 'name', 'timestamp'])
    .execute();
}

export async function down(db: Kysely<DB>): Promise<void> {
  await db.schema.dropTable('game_event').ifExists().execute();
}
