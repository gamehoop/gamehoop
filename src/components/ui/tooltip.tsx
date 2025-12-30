import { Tooltip as BaseTooltip } from '@mantine/core';
import { PropsWithChildren } from 'react';

export interface TooltipProps extends PropsWithChildren {
  className?: string;
  label: string;
  openDelay?: number;
  position: 'top' | 'right' | 'bottom' | 'left';
  withArrow?: boolean;
}

export function Tooltip(props: TooltipProps) {
  return <BaseTooltip {...props} />;
}
