import { Kysely, sql } from 'kysely';
import { DB } from '../schema';

export async function up(db: Kysely<DB>): Promise<void> {
  await db.schema
    .createTable('user')
    .addColumn('id', 'text', (col) => col.notNull().primaryKey())
    .addColumn('name', 'text', (col) => col.notNull())
    .addColumn('email', 'text', (col) => col.notNull().unique())
    .addColumn('email_verified', 'boolean', (col) => col.notNull())
    .addColumn('image', 'text')
    .addColumn('created_at', 'timestamptz', (col) =>
      col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull(),
    )
    .addColumn('updated_at', 'timestamptz', (col) =>
      col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull(),
    )
    .addColumn('dark_mode', 'boolean')
    .execute();

  await db.schema
    .createIndex('idx_user_email')
    .on('user')
    .column('email')
    .execute();

  await db.schema
    .createTable('session')
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
      col.notNull().references('user.id').onDelete('cascade'),
    )
    .addColumn('active_organization_id', 'text')
    .execute();

  await db.schema
    .createIndex('idx_session_user_id_token')
    .on('session')
    .columns(['user_id', 'token'])
    .execute();

  await db.schema
    .createTable('account')
    .addColumn('id', 'text', (col) => col.notNull().primaryKey())
    .addColumn('account_id', 'text', (col) => col.notNull())
    .addColumn('provider_id', 'text', (col) => col.notNull())
    .addColumn('user_id', 'text', (col) =>
      col.notNull().references('user.id').onDelete('cascade'),
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
    .createIndex('idx_account_user_id')
    .on('account')
    .column('user_id')
    .execute();

  await db.schema
    .createTable('verification')
    .addColumn('id', 'text', (col) => col.notNull().primaryKey())
    .addColumn('identifier', 'text', (col) => col.notNull())
    .addColumn('value', 'text', (col) => col.notNull())
    .addColumn('expires_at', 'timestamptz', (col) => col.notNull())
    .addColumn('created_at', 'timestamptz', (col) =>
      col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull(),
    )
    .addColumn('updatedAt', 'timestamptz', (col) =>
      col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull(),
    )
    .execute();

  await db.schema
    .createIndex('idx_verification_identifier')
    .on('verification')
    .column('identifier')
    .execute();

  await db.schema
    .createTable('organization')
    .addColumn('id', 'text', (col) => col.notNull().primaryKey())
    .addColumn('name', 'text', (col) => col.notNull())
    .addColumn('slug', 'text', (col) => col.notNull().unique())
    .addColumn('logo', 'text')
    .addColumn('created_at', 'timestamptz', (col) =>
      col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull(),
    )
    .addColumn('metadata', 'text')
    .execute();

  await db.schema
    .createIndex('idx_organization_slug')
    .on('organization')
    .column('slug')
    .execute();

  await db.schema
    .createTable('member')
    .addColumn('id', 'text', (col) => col.notNull().primaryKey())
    .addColumn('organization_id', 'text', (col) =>
      col.notNull().references('organization.id').onDelete('cascade'),
    )
    .addColumn('user_id', 'text', (col) =>
      col.notNull().references('user.id').onDelete('cascade'),
    )
    .addColumn('role', 'text', (col) => col.notNull())
    .addColumn('created_at', 'timestamptz', (col) =>
      col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull(),
    )
    .execute();

  await db.schema
    .createIndex('idx_member_organization_id')
    .on('member')
    .column('organization_id')
    .execute();

  await db.schema
    .createIndex('idx_member_user_id')
    .on('member')
    .column('user_id')
    .execute();

  await db.schema
    .createTable('invitation')
    .addColumn('id', 'text', (col) => col.notNull().primaryKey())
    .addColumn('organization_id', 'text', (col) =>
      col.notNull().references('organization.id').onDelete('cascade'),
    )
    .addColumn('email', 'text', (col) => col.notNull())
    .addColumn('role', 'text')
    .addColumn('status', 'text', (col) => col.notNull())
    .addColumn('expires_at', 'timestamptz', (col) => col.notNull())
    .addColumn('created_at', 'timestamptz', (col) =>
      col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull(),
    )
    .addColumn('inviter_id', 'text', (col) =>
      col.notNull().references('user.id').onDelete('cascade'),
    )
    .execute();

  await db.schema
    .createIndex('idx_invitation_organization_id')
    .on('invitation')
    .column('organization_id')
    .execute();

  await db.schema
    .createIndex('idx_invitation_email')
    .on('invitation')
    .column('email')
    .execute();
}

export async function down(db: Kysely<DB>): Promise<void> {
  await db.schema.dropTable('invitation').ifExists().execute();
  await db.schema.dropTable('member').ifExists().execute();
  await db.schema.dropTable('organization').ifExists().execute();
  await db.schema.dropTable('verification').ifExists().execute();
  await db.schema.dropTable('account').ifExists().execute();
  await db.schema.dropTable('session').ifExists().execute();
  await db.schema.dropTable('user').ifExists().execute();
}
