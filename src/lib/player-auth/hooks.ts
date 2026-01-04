import { db } from '@/db';
import { createAuthMiddleware } from 'better-auth/plugins';

export function createHooks(gameId: number) {
  return {
    before: createAuthMiddleware(async ({ context }) => {
      const internalCreateUser = context.internalAdapter.createUser.bind(
        context.internalAdapter,
      );

      context.internalAdapter.createUser = async (data) => {
        return internalCreateUser({ ...data, gameId });
      };

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
  };
}
