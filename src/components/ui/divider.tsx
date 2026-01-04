import { UISize } from '@/components/ui';
import { Divider as BaseDivider } from '@mantine/core';

export interface DividerProps {
  className?: string;
  label?: string;
  labelPosition?: 'center' | 'left' | 'right';
  size?: UISize;
}

export function Divider(props: DividerProps) {
  return <BaseDivider my="md" {...props} />;
}
