import { NavLink as BaseNavLink } from '@mantine/core';
import { ReactNode } from 'react';

export interface NavLinkProps {
  className?: string;
  component?: any;
  description?: string;
  label?: string;
  leftSection?: ReactNode;
  onClick?: () => void;
  to?: string;
}

export function NavLink(props: NavLinkProps) {
  return <BaseNavLink {...props} />;
}
