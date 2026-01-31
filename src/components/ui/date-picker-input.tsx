import {
  DatePickerInput as BaseDatePickerInput,
  DatesRangeValue,
} from '@mantine/dates';
import { ReactNode } from 'react';
import { UISize } from '.';

export interface DatePickerInputProps {
  className?: string;
  clearable?: boolean;
  date?: string | Date;
  defaultValue?: string | Date;
  description?: string;
  disabled?: boolean;
  error?: string;
  label?: string;
  leftSection?: ReactNode;
  onChange?: (
    value: string | string[] | DatesRangeValue<string> | null,
  ) => void;
  placeholder?: string;
  presets?: Array<{ value: string | null; label: string }>;
  name: string;
  readOnly?: boolean;
  required?: boolean;
  size?: UISize;
  type?: 'default' | 'multiple' | 'range';
  value?: string | string[] | DatesRangeValue<string> | null;
}

export function DatePickerInput(props: DatePickerInputProps) {
  return <BaseDatePickerInput {...props} />;
}
