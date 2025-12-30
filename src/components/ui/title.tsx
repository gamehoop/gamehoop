import { Title as BaseTitle } from '@mantine/core';
import { PropsWithChildren } from 'react';

export interface TitleProps extends PropsWithChildren {
  className?: string;
  order: 1 | 2 | 3 | 4 | 5 | 6;
}

export function Title(props: TitleProps) {
  return <BaseTitle {...props} />;
}
