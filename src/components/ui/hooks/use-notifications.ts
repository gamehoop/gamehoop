import { DefaultMantineColor } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { ReactNode } from 'react';

export function useNotifications() {
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
      message: string;
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
    info: factory('blue'),
    success: factory('green'),
    warning: factory('yellow'),
    error: factory('red'),
  };
}
