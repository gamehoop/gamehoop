import { NavLink as BaseNavLink } from '@mantine/core';
import { ReactNode } from 'react';
import { UISize } from '.';

export interface NavLinkProps {
  activeOptions?: { exact?: boolean };
  className?: string;
  component?: any;
  description?: string;
  disabled?: boolean;
  label?: string;
  leftSection?: ReactNode;
  onClick?: () => void;
  size?: UISize;
  to?: string;
}

export function NavLink({ size, ...props }: NavLinkProps) {
  return <BaseNavLink p={size} {...props} />;
}
