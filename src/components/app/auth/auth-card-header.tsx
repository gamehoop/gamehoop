import logo from '@/assets/logo-full.png';
import { AnchorLink } from '@/components/app/ui/anchor-link';
import { env } from '@/env/client';
import { Title } from '@mantine/core';
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
          className="cursor-pointer"
          width={140}
          height={140}
        />
      </AnchorLink>
    </div>
  );
}
