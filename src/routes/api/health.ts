import { db } from '@/db';
import { env } from '@/env/client';
import { logger } from '@/lib/logger';
import { HttpStatus } from '@/utils/http';
import { createFileRoute } from '@tanstack/react-router';
import { sql } from 'kysely';

const processStartDate = new Date(Date.now() - process.uptime() * 1000);

export const Route = createFileRoute('/api/health')({
  server: {
    handlers: {
      GET,
    },
  },
});

export async function GET() {
  const database = await getDatabaseStatus();

  const status =
    database === 'healthy' ? HttpStatus.Ok : HttpStatus.ServerError;

  return Response.json(
    {
      commit: env.VITE_SOURCE_COMMIT ?? '',
      database,
      memoryMB: Math.round(process.memoryUsage().rss / 1024 / 1024),
      timestamp: processStartDate.toISOString(),
      uptimeSeconds: Math.floor(process.uptime()),
    },
    {
      status,
    },
  );
}

async function getDatabaseStatus() {
  try {
    await sql`SELECT 1`.execute(db);
    return 'healthy';
  } catch (err) {
    logger.error(err);
    return 'unhealthy';
  }
}
