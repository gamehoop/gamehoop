import { UIPosition, UISize } from '@/components/ui';
import { Menu as BaseMenu } from '@mantine/core';
import { MouseEventHandler, PropsWithChildren, ReactNode } from 'react';

export interface MenuProps extends PropsWithChildren {
  className?: string;
  disabled?: boolean;
  position?: UIPosition;
  radius?: UISize;
  shadow?: UISize;
  trigger?: 'hover' | 'click';
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
  disabled?: boolean;
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

export interface MenuSubTargetProps {
  children: ReactNode;
  className?: string;
}

export interface MenuSubProps {
  children: ReactNode;
  className?: string;
}

function MenuSub(props: MenuSubProps) {
  return <BaseMenu.Sub {...props} />;
}

Menu.Sub = MenuSub;

MenuSub.Target = function MenuSubTarget(props: MenuSubTargetProps) {
  return <BaseMenu.Sub.Target {...props} />;
};

export interface MenuSubItemProps {
  children: ReactNode;
  className?: string;
  disabled?: boolean;
  leftSection?: ReactNode;
}

MenuSub.Item = function MenuSubItem(props: MenuSubItemProps) {
  return <BaseMenu.Sub.Item {...props} />;
};

export interface MenuSubDropdownProps {
  children: ReactNode;
  className?: string;
}

MenuSub.Dropdown = function MenuSubDropdown(props: MenuSubDropdownProps) {
  return <BaseMenu.Sub.Dropdown {...props} />;
};
