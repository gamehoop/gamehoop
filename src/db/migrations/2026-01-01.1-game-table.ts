import { Kysely, sql } from 'kysely';
import { DB } from '../schema';

export async function up(db: Kysely<DB>): Promise<void> {
  await db.schema
    .createTable('game')
    .addColumn('id', 'serial', (col) => col.notNull().primaryKey())
    .addColumn('organization_id', 'text', (col) =>
      col.notNull().references('organization.id').onDelete('cascade'),
    )
    .addColumn('name', 'text', (col) => col.notNull())
    .addColumn('genre', 'text')
    .addColumn('platforms', sql`text[]`)
    .addColumn('sdk', 'text')
    .addColumn('logo', 'text')
    .addColumn('created_at', 'timestamptz', (col) =>
      col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull(),
    )
    .addColumn('updated_at', 'timestamptz', (col) =>
      col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull(),
    )
    .addColumn('created_by', 'text', (col) =>
      col.notNull().references('user.id'),
    )
    .addColumn('updated_by', 'text', (col) =>
      col.notNull().references('user.id'),
    )
    .execute();

  await db.schema
    .createIndex('idx_game_organization_id')
    .on('game')
    .column('organization_id')
    .execute();

  await db.schema
    .createIndex('uq_idx_game_organization_id_name')
    .on('game')
    .columns(['organization_id', 'name'])
    .unique()
    .execute();
}

export async function down(db: Kysely<DB>): Promise<void> {
  await db.schema.dropTable('game').ifExists().execute();
}
