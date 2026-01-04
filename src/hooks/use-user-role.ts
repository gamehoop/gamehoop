import { useSessionContext } from './use-session-context';

export function useUserRole() {
  const { user } = useSessionContext();

  return {
    isMember: user.role === 'member',
    isAdmin: user.role === 'admin',
    isOwner: user.role === 'owner',
    canAdmin: user.role === 'admin' || user.role === 'owner',
  };
}
