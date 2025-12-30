import { UISize } from '@/components/ui';
import { ActionIcon as BaseActionIcon } from '@mantine/core';
import { MouseEventHandler, PropsWithChildren } from 'react';

export interface ActionIconProps extends PropsWithChildren {
  className?: string;
  destructive?: boolean;
  disabled?: boolean;
  loading?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  radius?: UISize;
  size?: UISize;
  variant?:
    | 'default'
    | 'filled'
    | 'light'
    | 'outline'
    | 'subtle'
    | 'transparent';
}

export function ActionIcon({ destructive, ...props }: ActionIconProps) {
  const color = destructive ? 'red' : undefined;
  return <BaseActionIcon color={color} {...props} />;
}
