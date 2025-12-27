// The configuration file for the kysely CLI - https://github.com/kysely-org/kysely-ctl
// Used to run the database migrations.

import { defineConfig } from 'kysely-ctl';
import { db } from '../src/db';

export default defineConfig({
  kysely: db,
  migrations: {
    migrationFolder: '../src/db/migrations',
  },
});
