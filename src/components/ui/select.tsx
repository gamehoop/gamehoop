import { Select as BaseSelect } from '@mantine/core';
import { FocusEvent, PropsWithChildren } from 'react';

export interface SelectProps extends PropsWithChildren {
  className?: string;
  label?: string;
  name?: string;
  placeholder?: string;
  disabled?: boolean;
  value?: string;
  data: string[] | Array<{ label: string; value: string }>;
  required?: boolean;
  error?: string;
  onBlur?: (e: FocusEvent<HTMLInputElement>) => void;
  onChange?: (value: string | null) => void;
}

export function Select({ required, ...props }: SelectProps) {
  return <BaseSelect withAsterisk={required} {...props} />;
}
