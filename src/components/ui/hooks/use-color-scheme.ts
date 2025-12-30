import { useMantineColorScheme } from '@mantine/core';

export interface UseColorSchemeResult {
  colorScheme: 'light' | 'dark';
  setColorScheme: (value: 'light' | 'dark') => void;
  toggleColorScheme: () => void;
  isDarkTheme: boolean;
  isLightTheme: boolean;
}

export function useColorScheme(): UseColorSchemeResult {
  const { colorScheme, setColorScheme, toggleColorScheme } =
    useMantineColorScheme();
  return {
    colorScheme: colorScheme as 'light' | 'dark',
    setColorScheme,
    toggleColorScheme,
    isDarkTheme: colorScheme === 'dark',
    isLightTheme: colorScheme === 'light',
  };
}
