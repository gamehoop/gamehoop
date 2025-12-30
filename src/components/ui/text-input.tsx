import { UISize } from '@/components/ui';
import { TextInput as BaseTextInput } from '@mantine/core';
import { ChangeEvent, FocusEvent, KeyboardEvent, ReactNode } from 'react';

export interface TextInputProps {
  className?: string;
  description?: string;
  disabled?: boolean;
  error?: string;
  label?: string;
  leftSection?: ReactNode;
  onBlur?: (e: FocusEvent<HTMLInputElement>) => void;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  onKeyDown?: (e: KeyboardEvent<HTMLInputElement>) => void;
  placeholder?: string;
  name: string;
  radius?: UISize;
  required?: boolean;
  size?: UISize;
  type?: 'text' | 'email';
  value: string;
}

export function TextInput({ required, ...props }: TextInputProps) {
  return <BaseTextInput withAsterisk={required} {...props} />;
}
