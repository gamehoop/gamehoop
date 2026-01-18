import { DefaultMantineColor, useMantineTheme } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { ReactNode } from 'react';

export function useNotifications() {
  const theme = useMantineTheme();

  const factory =
    (color: DefaultMantineColor) =>
    ({
      title,
      message,
      id,
      autoClose,
      icon,
    }: {
      title?: string;
      message: string | ReactNode;
      id?: string;
      autoClose?: number | false;
      icon?: ReactNode;
    }) => {
      notifications.show({
        id,
        title,
        message,
        color,
        autoClose,
        icon,
      });
    };

  return {
    info: factory(theme.primaryColor),
    success: factory('green'),
    warning: factory('yellow'),
    error: factory('red'),
  };
}
