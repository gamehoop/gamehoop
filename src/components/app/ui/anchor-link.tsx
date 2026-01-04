import { Anchor, AnchorProps } from '@/components/ui/anchor';
import { Link } from '@tanstack/react-router';

export interface AnchorLinkProps extends AnchorProps {
  to: string;
  search?: Record<string, string>;
  activeProps?: Record<string, unknown>;
}

export function AnchorLink(props: AnchorLinkProps) {
  return <Anchor component={Link} {...props} />;
}
