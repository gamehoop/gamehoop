import { UISize } from '@/components/ui';
import { Badge as BaseBadge } from '@mantine/core';
import { PropsWithChildren } from 'react';

export interface BadgeProps extends PropsWithChildren {
  color?: string;
  fullWidth?: boolean;
  radius?: UISize;
  size?: UISize;
  variant?: 'filled' | 'light' | 'outline';
}

export function Badge(props: BadgeProps) {
  return <BaseBadge {...props} />;
}
