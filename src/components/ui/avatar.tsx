import { UISize } from '@/components/ui';
import { Avatar as BaseAvatar } from '@mantine/core';
import { MouseEventHandler, PropsWithChildren } from 'react';

export interface AvatarProps extends PropsWithChildren {
  alt?: string;
  className?: string;
  color?: string;
  name?: string;
  onClick?: MouseEventHandler<HTMLDivElement>;
  radius?: UISize;
  size?: UISize;
  src?: string;
  variant?: 'default' | 'filled' | 'light';
}

export function Avatar(props: AvatarProps) {
  return <BaseAvatar {...props} />;
}
