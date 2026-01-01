import {
  Select as BaseSelect,
  ComboboxItem,
  ComboboxLikeRenderOptionInput,
} from '@mantine/core';
import { FocusEvent, PropsWithChildren, ReactNode } from 'react';

export type SelectItem = ComboboxItem & { description?: string };

export interface SelectProps extends PropsWithChildren {
  className?: string;
  label?: string;
  name?: string;
  placeholder?: string;
  disabled?: boolean;
  value?: string;
  data: string[] | Array<SelectItem>;
  required?: boolean;
  error?: string;
  onBlur?: (e: FocusEvent<HTMLInputElement>) => void;
  onChange?: (value: string | null) => void;
  renderOption?: (item: ComboboxLikeRenderOptionInput<SelectItem>) => ReactNode;
}

export function Select({ required, ...props }: SelectProps) {
  return <BaseSelect withAsterisk={required} {...props} />;
}
