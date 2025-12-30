import { Tooltip as BaseTooltip } from '@mantine/core';
import { PropsWithChildren } from 'react';
import { UIPosition } from '.';

export interface TooltipProps extends PropsWithChildren {
  className?: string;
  label: string;
  openDelay?: number;
  position?: UIPosition;
  withArrow?: boolean;
}

export function Tooltip(props: TooltipProps) {
  return <BaseTooltip {...props} />;
}
