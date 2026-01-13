import { UISize } from '@/components/ui';
import { NumberInput as BaseTextInput } from '@mantine/core';
import { FocusEvent, KeyboardEvent, ReactNode } from 'react';

export interface NumberInputProps {
  allowDecimal?: boolean;
  allowNegative?: boolean;
  className?: string;
  description?: string;
  disabled?: boolean;
  error?: string;
  label?: string;
  leftSection?: ReactNode;
  onBlur?: (e: FocusEvent<HTMLInputElement>) => void;
  onChange?: (value: string | number) => void;
  onKeyDown?: (e: KeyboardEvent<HTMLInputElement>) => void;
  placeholder?: string;
  max?: number;
  min?: number;
  name: string;
  radius?: UISize;
  readOnly?: boolean;
  required?: boolean;
  rightSection?: ReactNode;
  size?: UISize;
  value: number;
}

export function NumberInput({ required, ...props }: NumberInputProps) {
  return <BaseTextInput withAsterisk={required} {...props} />;
}
