import { AnchorLink } from '@/components/app/ui/anchor-link';
import { Title } from '@/components/ui/title';

export function AuthenticationSettings() {
  return (
    <div>
      <Title order={4}>Authentication</Title>

      <p>
        Please use the{' '}
        <AnchorLink to="/forgot-password">Forgot Password</AnchorLink> page to
        change your password.
      </p>
    </div>
  );
}
