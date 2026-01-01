import { SessionContext } from '@/contexts/session-context';
import { useContext } from 'react';

export function useSessionContext() {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('Missing session context');
  }
  return context;
}
