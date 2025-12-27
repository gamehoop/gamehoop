import { CamelCasePlugin, Kysely, PostgresDialect } from 'kysely';
import { Pool } from 'pg';
import { logger } from '../lib/logger';
import { DB } from './schema';

// https://node-postgres.com/apis/pool
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // Max number of clients in the pool
  max: 20,
  // Disconnect and discard clients after 10s,
  idleTimeoutMillis: 10000,
  // Timeout new connection attempts after 30s
  connectionTimeoutMillis: 30000,
});

export const db = new Kysely<DB>({
  dialect: new PostgresDialect({ pool }),
  plugins: [
    // Automatically convert snake_case columns to camelCase properties
    new CamelCasePlugin(),
  ],
  log: (event) => {
    if (event.level === 'error') {
      logger.error(
        {
          error: event.error,
          sql: event.query.sql,
          duration: Number(event.queryDurationMillis.toFixed(2)),
        },
        'Query error',
      );
    } else if (process.env.DATABASE_LOGGER === 'true') {
      logger.info(
        {
          sql: event.query.sql,
          params: event.query.parameters,
          duration: Number(event.queryDurationMillis.toFixed(2)),
        },
        'Query executed',
      );
    }
  },
});
