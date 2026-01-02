import { NavLink as BaseNavLink } from '@mantine/core';
import { ReactNode } from 'react';
import { UISize } from '.';

export interface NavLinkProps {
  className?: string;
  component?: any;
  description?: string;
  disabled?: boolean;
  label?: string;
  leftSection?: ReactNode;
  onClick?: () => void;
  to?: string;
  activeOptions?: { exact?: boolean };
  size?: UISize;
}

export function NavLink({ size, ...props }: NavLinkProps) {
  return <BaseNavLink p={size} {...props} />;
}
