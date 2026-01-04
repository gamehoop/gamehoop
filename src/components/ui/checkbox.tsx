import { UISize } from '@/components/ui';
import { Checkbox as BaseCheckbox, useMantineTheme } from '@mantine/core';
import { ChangeEventHandler } from 'react';

export interface CheckboxProps {
  checked?: boolean;
  className?: string;
  defaultChecked?: boolean;
  description?: string;
  error?: string;
  indeterminate?: boolean;
  label?: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  size?: UISize;
}

export function Checkbox(props: CheckboxProps) {
  const theme = useMantineTheme();
  return <BaseCheckbox color={theme.primaryColor} {...props} />;
}
