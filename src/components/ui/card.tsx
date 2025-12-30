import { UISize } from '@/components/ui';
import { Card as BaseCard } from '@mantine/core';
import { PropsWithChildren } from 'react';

export interface CardProps extends PropsWithChildren {
  className?: string;
  radius?: UISize;
  shadow?: UISize;
  withBorder?: boolean;
}

export function Card(props: CardProps) {
  return <BaseCard {...props} />;
}

export interface CardSection extends PropsWithChildren {
  className?: string;
  withBorder?: boolean;
}

Card.Section = function CardSection(props: CardProps) {
  return <BaseCard.Section {...props} />;
};
