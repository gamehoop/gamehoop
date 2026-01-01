import { Organization, Role, User } from '@/lib/auth';
import { createContext } from 'react';

export interface SessionContextProps {
  user: User & { role: Role };
  organizations: Organization[];
  activeOrganization: Organization;
}

export const SessionContext = createContext<SessionContextProps | null>(null);
