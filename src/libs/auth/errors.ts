import { AlertProps } from '@/components/ui/alert';
import { BASE_ERROR_CODES } from 'better-auth';

export const getAlertPropsForError = ({
  code,
}: {
  code?: string;
  message?: string;
}): AlertProps => {
  switch (code as keyof typeof BASE_ERROR_CODES) {
    case 'USER_ALREADY_EXISTS':
    case 'USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL':
      return {
        status: 'error' as const,
        title: 'User already exists',
        children:
          'Please reset your password or use another email address to sign up.',
      };
    case 'INVALID_EMAIL':
    case 'INVALID_PASSWORD':
    case 'INVALID_EMAIL_OR_PASSWORD':
      return {
        status: 'error' as const,
        title: 'Invalid email or password',
        children: 'The email or password you entered is incorrect.',
      };
    case 'EMAIL_NOT_VERIFIED':
      return {
        status: 'error' as const,
        title: 'Unverified email',
        children: 'Please verify your email address before signing in.',
      };
    default:
      return {
        status: 'error' as const,
        title: 'Something went wrong',
        children: 'Please try again.',
      };
  }
};
