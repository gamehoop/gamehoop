import logoDark from '@/assets/logo-full-dark.svg';
import logo from '@/assets/logo-full.svg';
import { AnchorLink } from '@/components/app/ui/anchor-link';
import { Title } from '@/components/ui/title';
import { env } from '@/env/client';
import { Image } from '@unpic/react';
import { PropsWithChildren } from 'react';

export function AuthCardHeader({ children }: PropsWithChildren) {
  return (
    <div className="flex justify-between items-center mb-2">
      <Title order={2}>{children}</Title>
      <AnchorLink to="/" tabIndex={-1}>
        <Image
          src={logo}
          alt={env.VITE_APP_NAME}
          className="cursor-pointer dark:hidden"
          width={140}
          height={140}
        />
        <Image
          src={logoDark}
          alt={env.VITE_APP_NAME}
          className="cursor-pointer hidden dark:block"
          width={140}
          height={140}
        />
      </AnchorLink>
    </div>
  );
}
