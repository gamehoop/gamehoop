import { HttpStatus } from '@/utils/http';
import { describe, expect, it, vi } from 'vitest';
import { GET } from '../health';

const mockSql = vi.hoisted(() => vi.fn(() => ({ execute: vi.fn() })));

vi.mock('kysely', async (importOriginal) => {
  return {
    ...(await importOriginal()),
    sql: mockSql,
  };
});

describe('/api/health', () => {
  it('should return a service healthcheck', async () => {
    const res = await GET();
    expect(res.status).toBe(HttpStatus.Ok);
    expect(res.headers.get('Content-Type')).toStrictEqual('application/json');

    const body = await res.json();
    expect(body).toStrictEqual({
      commit: '',
      database: 'healthy',
      memoryMB: expect.any(Number),
      timestamp: expect.any(String),
      uptimeSeconds: expect.any(Number),
    });
  });

  it('should return an error if the database is unhealthy', async () => {
    mockSql.mockImplementation(() => {
      throw new Error();
    });

    const res = await GET();
    expect(res.status).toBe(HttpStatus.ServerError);
    const body = await res.json();
    expect(body.database).toStrictEqual('unhealthy');
  });
});
