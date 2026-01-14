import { db } from '@/db';
import { env } from '@/env/client';
import { logError } from '@/libs/logger';
import { HttpStatus } from '@/utils/http';
import { createFileRoute } from '@tanstack/react-router';
import { sql } from 'kysely';
import z from 'zod';

const processStartDate = new Date(Date.now() - process.uptime() * 1000);

const zResBody = z.object({
  commit: z.string(),
  database: z.enum(['healthy', 'unhealthy']),
  memoryMB: z.int().nonnegative(),
  timestamp: z.string(),
  uptimeSeconds: z.int().nonnegative(),
});

export async function GET() {
  const database = await getDatabaseStatus();

  const status =
    database === 'healthy' ? HttpStatus.Ok : HttpStatus.ServerError;

  const data = zResBody.parse({
    commit: env.VITE_SOURCE_COMMIT ?? '',
    database,
    memoryMB: Math.round(process.memoryUsage().rss / 1024 / 1024),
    timestamp: processStartDate.toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
  });

  return Response.json(data, { status });
}

async function getDatabaseStatus() {
  try {
    await sql`SELECT 1`.execute(db);
    return 'healthy';
  } catch (error) {
    logError(error);
    return 'unhealthy';
  }
}

export const Route = createFileRoute('/api/health')({
  server: {
    handlers: {
      GET,
    },
  },
});
