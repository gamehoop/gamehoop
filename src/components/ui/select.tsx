import {
  Select as BaseSelect,
  ComboboxItem,
  ComboboxLikeRenderOptionInput,
} from '@mantine/core';
import { FocusEvent, PropsWithChildren, ReactNode } from 'react';

export type SelectItem = ComboboxItem & {
  avatarSrc?: string;
  description?: string;
};

export interface SelectProps extends PropsWithChildren {
  className?: string;
  data: string[] | Array<SelectItem>;
  disabled?: boolean;
  error?: string;
  label?: string;
  leftSection?: ReactNode;
  onBlur?: (e: FocusEvent<HTMLInputElement>) => void;
  onChange?: (value: string | null) => void;
  name?: string;
  placeholder?: string;
  renderOption?: (item: ComboboxLikeRenderOptionInput<SelectItem>) => ReactNode;
  required?: boolean;
  value?: string;
}

export function Select({ required, ...props }: SelectProps) {
  return <BaseSelect withAsterisk={required} {...props} />;
}
