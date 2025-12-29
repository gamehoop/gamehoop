import logoDark from '@/assets/logo-full-dark.svg';
import logo from '@/assets/logo-full.svg';
import { AnchorLink } from '@/components/app/ui/anchor-link';
import { useColorScheme } from '@/components/ui/hooks/use-color-scheme';
import { env } from '@/env/client';
import { Title } from '@mantine/core';
import { Image } from '@unpic/react';
import { PropsWithChildren } from 'react';

export function AuthCardHeader({ children }: PropsWithChildren) {
  const { isDarkTheme } = useColorScheme();

  return (
    <div className="flex justify-between items-center mb-2">
      <Title order={2}>{children}</Title>
      <AnchorLink to="/" tabIndex={-1}>
        <Image
          src={isDarkTheme ? logoDark : logo}
          alt={env.VITE_APP_NAME}
          className="cursor-pointer"
          width={140}
          height={140}
        />
      </AnchorLink>
    </div>
  );
}
