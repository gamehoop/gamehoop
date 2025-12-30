import {
  NavLink as BaseNavLink,
  NavLinkProps as BaseNavLinkProps,
} from '@/components/ui/nav-link';
import { Link } from '@tanstack/react-router';

export interface NavLinkProps extends BaseNavLinkProps {
  to?: string;
}

export function NavLink(props: NavLinkProps) {
  return <BaseNavLink component={Link} {...props} />;
}
