import { useMantineColorScheme } from '@mantine/core';

export interface UseColorSchemeResult {
  colorScheme: 'light' | 'dark';
  setColorScheme: (value: 'light' | 'dark') => void;
  toggleColorScheme: () => void;
  isDarkTheme: boolean;
  isLightTheme: boolean;
}

export function useColorScheme() {
  const { colorScheme, setColorScheme, toggleColorScheme } =
    useMantineColorScheme();
  return {
    colorScheme,
    setColorScheme,
    toggleColorScheme,
    isDarkTheme: colorScheme === 'dark',
    isLightTheme: colorScheme === 'light',
  };
}
