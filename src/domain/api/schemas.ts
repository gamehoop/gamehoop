import z from 'zod';

export const zPlayer = z.object({
  id: z.string(),
  name: z.string(),
  email: z.email(),
  emailVerified: z.boolean(),
  gameId: z.string(),
  image: z.string().nullable(),
  isAnonymous: z.boolean(),
  createdAt: z.date().transform((date) => date.toISOString()),
  updatedAt: z.date().transform((date) => date.toISOString()),
  lastLoginAt: z
    .date()
    .nullable()
    .transform((date) => date?.toISOString() ?? null),
});

export const zGameEventProperty = z.union([
  z.string(),
  z.number(),
  z.boolean(),
  z.array(z.union([z.string(), z.number(), z.boolean()])),
]);

export const zGameEventProperties = z.record(z.string(), zGameEventProperty);

export const zGameEvent = z.object({
  id: z.string(),
  gameId: z.string(),
  name: z.string(),
  playerId: z.string().nullable(),
  properties: zGameEventProperties.optional(),
  sessionId: z.string().nullable(),
  deviceId: z.string().nullable(),
  timestamp: z.date().transform((date) => date.toISOString()),
  createdAt: z.date().transform((date) => date.toISOString()),
});

export const zPage = <S extends z.ZodTypeAny>(schema: S) =>
  z.object({
    data: z.array(schema),
    total: z.int().nonnegative(),
    page: z.int().positive(),
    pageSize: z.int().positive(),
    hasNextPage: z.boolean(),
    hasPrevPage: z.boolean(),
  });
