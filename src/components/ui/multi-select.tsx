import {
  MultiSelect as BaseMultiSelect,
  ComboboxItem,
  ComboboxLikeRenderOptionInput,
} from '@mantine/core';
import { FocusEvent, PropsWithChildren, ReactNode } from 'react';

export type MultiSelectItem = ComboboxItem & {
  avatarSrc?: string;
  description?: string;
};

export interface MultiSelectProps extends PropsWithChildren {
  className?: string;
  label?: string;
  name?: string;
  placeholder?: string;
  disabled?: boolean;
  value?: string[];
  data: string[] | Array<MultiSelectItem>;
  required?: boolean;
  error?: string;
  onBlur?: (e: FocusEvent<HTMLInputElement>) => void;
  onChange?: (value: string[] | null) => void;
  renderOption?: (
    item: ComboboxLikeRenderOptionInput<MultiSelectItem>,
  ) => ReactNode;
  leftSection?: ReactNode;
}

export function MultiSelect({ required, ...props }: MultiSelectProps) {
  return <BaseMultiSelect withAsterisk={required} {...props} />;
}
