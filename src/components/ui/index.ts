import { MantineProvider, mantineHtmlProps } from '@mantine/core';

export { ColorSchemeScript } from '@mantine/core';

export const UIProvider = MantineProvider;

export const uiHtmlProps = mantineHtmlProps;

export type UISize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
