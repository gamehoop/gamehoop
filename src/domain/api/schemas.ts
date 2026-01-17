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
    .transform((date) => date?.toISOString()),
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
