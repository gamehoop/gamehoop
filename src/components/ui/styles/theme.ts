import {
  ActionIcon,
  Alert,
  Anchor,
  Badge,
  Burger,
  Button,
  Card,
  Checkbox,
  Input,
  InputLabel,
  createTheme as mantineCreateTheme,
  Menu,
  Modal,
  NavLink,
  Notification,
  PasswordInput,
  Select,
  Switch,
  Textarea,
  TextInput,
  type MantineThemeOverride,
} from '@mantine/core';

export type ThemeOverride = MantineThemeOverride;

export function createTheme(): { theme: ThemeOverride; themeColor: string } {
  // https://mantine.dev/theming/colors/#default-colors
  const primaryColor = 'cyan';
  const primaryColorHex = '#22b8cf';

  // https://mantine.dev/theming/theme-object
  const theme = mantineCreateTheme({
    primaryColor,
    fontFamily: 'Nunito Sans Variable, system-ui, sans-serif',
    cursorType: 'pointer',
    breakpoints: {
      xs: '40rem',
      sm: '48rem',
      md: '64rem',
      lg: '80rem',
      xl: '96rem',
    },
    components: {
      ActionIcon: ActionIcon.extend({
        defaultProps: {
          size: 'md',
          radius: 'xl',
          variant: 'filled',
        },
      }),
      Alert: Alert.extend({
        defaultProps: {
          radius: 'md',
          variant: 'light',
        },
      }),
      Anchor: Anchor.extend({
        defaultProps: {
          size: 'md',
          fz: 'md',
          underline: 'hover',
        },
      }),
      Badge: Badge.extend({
        defaultProps: {
          variant: 'light',
          size: 'md',
          radius: 'xl',
        },
      }),
      Burger: Burger.extend({
        defaultProps: {
          size: 'md',
        },
      }),
      Button: Button.extend({
        defaultProps: {
          radius: 'xl',
          variant: 'filled',
          size: 'md',
        },
      }),
      Card: Card.extend({
        defaultProps: {
          p: 'xl',
          radius: 'xl',
          shadow: 'xl',
          withBorder: true,
        },
      }),
      Checkbox: Checkbox.extend({
        defaultProps: {
          size: 'md',
        },
      }),
      CardSection: Card.Section.extend({
        defaultProps: {
          p: 'md',
        },
      }),
      Input: Input.extend({
        defaultProps: {
          size: 'md',
        },
      }),
      InputLabel: InputLabel.extend({
        defaultProps: {
          size: 'md',
        },
      }),
      Modal: Modal.extend({
        defaultProps: {
          centered: true,
          radius: 'lg',
          size: 'lg',
          shadow: 'xl',
        },
      }),
      MenuItem: Menu.Item.extend({
        defaultProps: {
          fz: 'md',
        },
      }),
      Select: Select.extend({
        defaultProps: {
          size: 'md',
        },
      }),
      TextInput: TextInput.extend({
        defaultProps: {
          size: 'md',
        },
      }),
      PasswordInput: PasswordInput.extend({
        defaultProps: {
          size: 'md',
        },
      }),
      Textarea: Textarea.extend({
        defaultProps: {
          size: 'md',
        },
      }),
      NavLink: NavLink.extend({
        styles: {
          label: {
            fontSize: '1rem',
          },
        },
      }),
      Switch: Switch.extend({
        defaultProps: {
          size: 'md',
        },
      }),
      Notification: Notification.extend({
        defaultProps: {
          withBorder: true,
          withCloseButton: false,
          radius: 'md',
        },
      }),
    },
  });

  return { theme, themeColor: primaryColorHex };
}
