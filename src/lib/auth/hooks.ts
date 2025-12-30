import { createAuthMiddleware } from 'better-auth/plugins';
import { auth, Session } from '.';

export const after = createAuthMiddleware(async ({ path, context }) => {
  if (path.startsWith('/sign-up') && context.newSession) {
    await createUserOrganization(context.newSession);
  }
});

async function createUserOrganization(newSession: Session) {
  const org = await auth.api.createOrganization({
    body: {
      name: `${newSession.user.name}'s Organization`,
      slug: `org-${newSession.user.id}`,
      userId: newSession.user.id,
    },
  });

  if (!org) {
    throw new Error(
      `Failed to create organization for user ${newSession.user.id}`,
    );
  }
}

export const hooks = { after };
