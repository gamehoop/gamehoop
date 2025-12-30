import { Anchor, AnchorProps } from '@/components/ui/anchor';
import { Link } from '@tanstack/react-router';

export interface AnchorLinkProps extends AnchorProps {
  to: string;
  activeProps?: Record<string, unknown>;
}

// https://tanstack.com/router/latest/docs/framework/react/api/router/linkComponent#link-returns
export function AnchorLink(props: AnchorLinkProps) {
  return <Anchor component={Link} {...props} />;
}
