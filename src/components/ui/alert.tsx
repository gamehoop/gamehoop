import { themeColor } from '@/styles/theme';
import { Alert as BaseAlert } from '@mantine/core';
import { CircleAlert, Info } from 'lucide-react';
import { PropsWithChildren, ReactNode } from 'react';

export interface AlertProps extends PropsWithChildren {
  className?: string;
  title: string;
  status?: 'info' | 'success' | 'warning' | 'error';
}

// https://mantine.dev/core/alert
export function Alert({
  children,
  title,
  status = 'info',
  ...props
}: AlertProps) {
  const [color, icon] = getColor(status);

  return (
    <BaseAlert
      color={color}
      icon={icon}
      title={title}
      variant="light"
      {...props}
    >
      {children}
    </BaseAlert>
  );
}

function getColor(status: AlertProps['status']): [string, ReactNode] {
  switch (status) {
    case 'success':
      return ['green', <Info key={status} />];
    case 'warning':
      return ['yellow', <CircleAlert key={status} />];
    case 'error':
      return ['red', <CircleAlert key={status} />];
    default:
      return [themeColor, <Info key={status} />];
  }
}
