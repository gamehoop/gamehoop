import { UISize } from '@/components/ui';
import { PasswordInput as BasePasswordInput } from '@mantine/core';
import { ChangeEvent, FocusEvent, KeyboardEvent, ReactNode } from 'react';

export interface PasswordInputProps {
  className?: string;
  description?: string;
  disabled?: boolean;
  error?: string;
  label?: string | ReactNode;
  labelProps?: Record<string, string>;
  leftSection?: ReactNode;
  name: string;
  onBlur?: (e: FocusEvent<HTMLInputElement>) => void;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  onKeyDown?: (e: KeyboardEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  size?: UISize;
  value: string;
}

export function PasswordInput({ required, ...props }: PasswordInputProps) {
  return <BasePasswordInput withAsterisk={required} {...props} />;
}
