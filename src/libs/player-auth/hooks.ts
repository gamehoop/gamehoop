import { db } from '@/db';
import { createAuthMiddleware } from 'better-auth/plugins';

export function createHooks(gameId: string) {
  return {
    before: createAuthMiddleware(async ({ context }) => {
      const internalCreateUser = context.internalAdapter.createUser.bind(
        context.internalAdapter,
      );

      // Create player "users" with a gameId
      context.internalAdapter.createUser = async (data) => {
        return internalCreateUser({ ...data, gameId });
      };

      // Find player "users" by email with a gameId
      context.internalAdapter.findUserByEmail = async (
        email: string,
        options?: { includeAccounts?: boolean },
      ) => {
        const user = await db
          .selectFrom('player')
          .where('email', '=', email)
          .where('gameId', '=', gameId)
          .selectAll()
          .executeTakeFirst();
        if (!user) {
          return null;
        }

        if (options?.includeAccounts) {
          const accounts = await db
            .selectFrom('playerAccount')
            .where('userId', '=', user.id)
            .selectAll()
            .execute();
          return { user, accounts: accounts };
        } else {
          return { user, accounts: [] };
        }
      };
    }),
    after: createAuthMiddleware(async ({ path, context }) => {
      // Track the last login time on sign in
      if (path.startsWith('/sign-in') && context.newSession) {
        await db
          .updateTable('player')
          .set({
            lastLoginAt: new Date().toISOString(),
          })
          .where('id', '=', context.newSession.user.id)
          .execute();
      }
    }),
  };
}
