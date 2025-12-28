import { useMantineColorScheme } from '@mantine/core';

export interface UseColorSchemeResult {
  colorScheme: 'light' | 'dark';
  setColorScheme: (value: 'light' | 'dark') => void;
  toggleColorScheme: () => void;
}

export function useColorScheme() {
  const { colorScheme, setColorScheme, toggleColorScheme } =
    useMantineColorScheme();
  return { colorScheme, setColorScheme, toggleColorScheme };
}
