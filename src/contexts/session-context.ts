import { Game } from '@/db/types';
import { Organization, Role, User } from '@/libs/auth';
import { createContext } from 'react';

export interface SessionContextProps {
  user: User & { role: Role };
  organizations: Organization[];
  activeOrganization: Organization & { games: Game[]; activeGame: Game | null };
}

export const SessionContext = createContext<SessionContextProps | null>(null);
