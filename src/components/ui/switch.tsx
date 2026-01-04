import { UISize } from '@/components/ui';
import { Switch as BaseSwitch } from '@mantine/core';
import { ChangeEventHandler, FocusEventHandler, ReactNode } from 'react';

export interface SwitchProps {
  checked: boolean;
  description?: string;
  disabled?: boolean;
  error?: string;
  label: string;
  labelPosition?: 'left' | 'right';
  name: string;
  offLabel?: ReactNode;
  onBlur: FocusEventHandler<HTMLInputElement>;
  onChange: ChangeEventHandler<HTMLInputElement>;
  onLabel?: ReactNode;
  radius?: UISize;
  size?: UISize;
}

export function Switch(props: SwitchProps) {
  return <BaseSwitch {...props} />;
}
