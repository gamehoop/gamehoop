import { Organization, User } from '@/lib/auth';
import { createContext } from 'react';

export interface SessionContextProps {
  user: User;
  organizations: Organization[];
  activeOrganization: Organization;
}

export const SessionContext = createContext<SessionContextProps | null>(null);
