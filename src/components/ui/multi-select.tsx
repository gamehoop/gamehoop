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
  data: string[] | Array<MultiSelectItem>;
  disabled?: boolean;
  error?: string;
  label?: string;
  leftSection?: ReactNode;
  name?: string;
  onBlur?: (e: FocusEvent<HTMLInputElement>) => void;
  onChange?: (value: string[] | null) => void;
  placeholder?: string;
  renderOption?: (
    item: ComboboxLikeRenderOptionInput<MultiSelectItem>,
  ) => ReactNode;
  required?: boolean;
  value?: string[];
}

export function MultiSelect({ required, ...props }: MultiSelectProps) {
  return <BaseMultiSelect withAsterisk={required} {...props} />;
}
