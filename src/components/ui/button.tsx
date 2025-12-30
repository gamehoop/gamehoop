import { Button as BaseButton } from '@mantine/core';
import { PropsWithChildren, ReactNode } from 'react';
import { UISize } from '.';

export interface ButtonProps extends PropsWithChildren {
  className?: string;
  destructive?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  leftSection?: ReactNode;
  loading?: boolean;
  onClick: () => void;
  size?: UISize;
  variant?: 'default' | 'filled' | 'light' | 'outline' | 'subtle';
}

export function Button({ destructive, ...props }: ButtonProps) {
  const color = destructive ? 'red' : undefined;
  return <BaseButton color={color} {...props} />;
}
