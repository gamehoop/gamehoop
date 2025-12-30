import { Button as BaseButton } from '@mantine/core';
import { PropsWithChildren, ReactNode } from 'react';
import { UISize } from '.';

export interface ButtonProps extends PropsWithChildren {
  disabled?: boolean;
  fullWidth?: boolean;
  leftSection?: ReactNode;
  loading?: boolean;
  onClick: () => void;
  size?: UISize;
}

export function Button(props: ButtonProps) {
  return <BaseButton {...props} />;
}
