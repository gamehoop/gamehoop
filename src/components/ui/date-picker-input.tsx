import { DatePickerInput as BaseDatePickerInput } from '@mantine/dates';

export interface DatePickerInputProps {
  className?: string;
  clearable?: boolean;
  date?: string | Date;
  defaultValue?: string | Date;
  description?: string;
  disabled?: boolean;
  error?: string;
  label?: string;
  onChange?: (value: string | null) => void;
  presets?: Array<{ value: string | null; label: string }>;
  name: string;
  readOnly?: boolean;
  required?: boolean;
}

export function DatePickerInput(props: DatePickerInputProps) {
  return <BaseDatePickerInput {...props} />;
}
