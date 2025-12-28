import { UISize } from '@/components/ui';
import { Anchor as BaseAnchor } from '@mantine/core';
import { MouseEvent, PropsWithChildren } from 'react';

export interface AnchorProps extends PropsWithChildren {
  className?: string;
  component?: any;
  onClick?: (e: MouseEvent) => void;
  size?: UISize;
  tabIndex?: number;
  underline?: 'always' | 'hover' | 'never';
}

// https://mantine.dev/core/anchor
export function Anchor({ children, size = 'md', ...props }: AnchorProps) {
  return (
    <BaseAnchor fz={size} {...props}>
      {children}
    </BaseAnchor>
  );
}
