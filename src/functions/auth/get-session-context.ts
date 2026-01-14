import { SessionContextProps } from '@/contexts/session-context';
import { Game } from '@/db/types';
import { getUser } from '@/functions/auth/get-user';
import { auth, Member, Organization, User } from '@/libs/auth';
import { gameRepo } from '@/repos/game-repo';
import { createServerFn } from '@tanstack/react-start';
import { getRequestHeaders } from '@tanstack/react-start/server';

export const getSessionContext = createServerFn().handler(
  async (): Promise<SessionContextProps> => {
    const [user, organizations] = await Promise.all([
      getUser(),
      auth.api.listOrganizations({ headers: getRequestHeaders() }),
    ]);

    const activeOrganization = findActiveOrganization(user, organizations);

    const [userMembership, activeOrganizationGames] = await Promise.all([
      getUserMembership(user, activeOrganization),
      gameRepo.findMany({ where: { organizationId: activeOrganization.id } }),
    ]);

    const activeGame = findActiveGame(user, activeOrganizationGames);

    return {
      user: {
        ...user,
        role: userMembership.role,
      },
      organizations,
      activeOrganization: {
        ...activeOrganization,
        games: activeOrganizationGames,
        activeGame,
      },
    };
  },
);

function findActiveOrganization(
  user: User,
  organizations: Organization[],
): Organization {
  const activeOrganization =
    organizations.find(
      (org) => org.id === user.settings?.activeOrganizationId,
    ) ?? organizations[0];

  if (!activeOrganization) {
    throw new Error(`No active organization found for user ${user.id}`);
  }

  return activeOrganization;
}

async function getUserMembership(
  user: User,
  activeOrganization: Organization,
): Promise<Member> {
  const page = await auth.api.listMembers({
    query: {
      organizationId: activeOrganization.id,
      limit: 1,
      filterField: 'userId',
      filterOperator: 'eq',
      filterValue: user.id,
    },
    headers: getRequestHeaders(),
  });

  const member = page.members[0];
  if (!member) {
    throw new Error(
      `User ${user.id} is not a member of organization ${activeOrganization.id}`,
    );
  }

  return member;
}

function findActiveGame(
  user: User,
  activeOrganizationGames: Game[],
): Game | null {
  return (
    activeOrganizationGames.find(
      (game) => game.id === user.settings?.activeGameId,
    ) ?? null
  );
}
