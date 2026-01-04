import { UISize } from '@/components/ui';
import { Textarea as BaseTextarea } from '@mantine/core';
import { ChangeEvent, FocusEvent, KeyboardEvent } from 'react';

export interface TextareaProps {
  className?: string;
  description?: string;
  disabled?: boolean;
  error?: string;
  label?: string;
  name: string;
  onBlur?: (e: FocusEvent<HTMLTextAreaElement>) => void;
  onChange?: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  onKeydown?: (e: KeyboardEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  radius?: UISize;
  required?: boolean;
  size?: UISize;
  value: string;
}

export function Textarea({ required, ...props }: TextareaProps) {
  return (
    <BaseTextarea
      withAsterisk={required}
      styles={{ wrapper: { height: '100%' }, input: { height: '100%' } }}
      {...props}
    />
  );
}
