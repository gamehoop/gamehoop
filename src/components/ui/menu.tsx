import { UIPosition, UISize } from '@/components/ui';
import { Menu as BaseMenu } from '@mantine/core';
import { MouseEventHandler, PropsWithChildren, ReactNode } from 'react';

export interface MenuProps extends PropsWithChildren {
  className?: string;
  disabled?: boolean;
  radius?: UISize;
  shadow?: UISize;
  trigger?: 'hover' | 'click';
  position?: UIPosition;
  width?: number;
  withArrow?: boolean;
}

export function Menu(props: MenuProps) {
  return <BaseMenu {...props} />;
}

export interface MenuTargetProps {
  children: ReactNode;
  className?: string;
}

Menu.Target = function MenuTarget(props: MenuTargetProps) {
  return <BaseMenu.Target {...props} />;
};

export interface MenuItemProps extends PropsWithChildren {
  className?: string;
  leftSection?: ReactNode;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

Menu.Item = function MenuItem(props: MenuItemProps) {
  return <BaseMenu.Item {...props} />;
};

export interface MenuDropdownProps extends PropsWithChildren {
  className?: string;
}

Menu.Dropdown = function MenuDropdown(props: MenuDropdownProps) {
  return <BaseMenu.Dropdown {...props} />;
};

export interface MenuLabelProps extends PropsWithChildren {
  className?: string;
}

Menu.Label = function MenuLabel(props: MenuLabelProps) {
  return <BaseMenu.Label {...props} />;
};

export interface MenuDividerProps {
  className?: string;
}

Menu.Divider = function MenuDivider(props: MenuDividerProps) {
  return <BaseMenu.Divider {...props} />;
};

export interface MenuSubProps {
  children: ReactNode;
  className?: string;
}

Menu.Sub = function MenuSub(props: MenuSubProps) {
  return <BaseMenu.Sub {...props} />;
};
