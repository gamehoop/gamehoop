import { UISize } from '@/components/ui';
import { Avatar as BaseAvatar } from '@mantine/core';
import { MouseEventHandler } from 'react';

export interface AvatarProps {
  alt?: string;
  className?: string;
  name?: string;
  onClick?: MouseEventHandler<HTMLDivElement>;
  radius?: UISize;
  size?: UISize;
  src?: string;
}

export function Avatar(props: AvatarProps) {
  return <BaseAvatar {...props} />;
}
