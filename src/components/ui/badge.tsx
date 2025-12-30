import { UISize } from '@/components/ui';
import { Badge as BaseBadge } from '@mantine/core';
import { PropsWithChildren } from 'react';

export interface BadgeProps extends PropsWithChildren {
  variant?: 'filled' | 'light' | 'outline';
  size?: UISize;
  radius?: UISize;
  fullWidth?: boolean;
}

// https://mantine.dev/core/badge
export function Badge(props: BadgeProps) {
  return <BaseBadge {...props} />;
}
