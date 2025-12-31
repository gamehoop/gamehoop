import { db } from '@/db';
import { env } from '@/env/server';
import {
  sendChangeEmailConfirmation,
  sendDeleteAccountVerification,
  sendInvitationEmail,
  sendResetPassword,
  sendVerificationEmail,
} from '@/lib/auth/emails';
import { logger } from '@/lib/logger';
import {
  daysToSeconds,
  hoursToSeconds,
  minutesToSeconds,
} from '@/utils/datetime';
import { betterAuth } from 'better-auth';
import { organization } from 'better-auth/plugins';
import { tanstackStartCookies } from 'better-auth/tanstack-start';
import { hooks } from './hooks';

// https://better-auth.vercel.app/docs/reference/options
export const auth = betterAuth({
  database: {
    db,
    // The better auth tables use snake_case
    casing: 'snake',
  },
  emailAndPassword: {
    // Enable email and password authentication
    enabled: true,
    // Automatically sign in after signing up
    autoSignIn: true,
    // Require a verfified email to sign in
    requireEmailVerification: env.BETTER_AUTH_REQUIRE_EMAIL_VERIFICATION,
    // Passwords must be at least this length
    minPasswordLength: 8,
    // Passwords cannot be greater than this length
    maxPasswordLength: 128,
    // The token sent to a user in the reset password flow expires after 1 hour
    resetPasswordTokenExpiresIn: hoursToSeconds(1),
    // To send the reset password email
    sendResetPassword,
  },
  emailVerification: {
    // Send a verification email on sign up
    sendOnSignUp: env.BETTER_AUTH_REQUIRE_EMAIL_VERIFICATION,
    // Automatically sign in after the email is verified
    autoSignInAfterVerification: true,
    // To send the verification email
    sendVerificationEmail,
  },
  user: {
    // Additional columns to add to the user database table
    additionalFields: {
      settings: {
        type: 'json',
        required: false,
        defaultValue: {},
      },
    },
    changeEmail: {
      // Allow users to change their email
      enabled: true,
      // Send email to current address for users to confirm a change of address
      sendChangeEmailConfirmation,
    },
    deleteUser: {
      // Allow users to delete their accounts
      enabled: true,
      // To send the delete verification email
      sendDeleteAccountVerification,
    },
  },
  session: {
    // Expire a session in 7 days
    expiresIn: daysToSeconds(7),
    // Refresh a session every 1 day
    updateAge: daysToSeconds(1),
    // Some operations require a fresh session.
    // Consider a session fresh if it is less than 12 hours old
    // TODO: freshAge: hoursToSeconds(12),
    freshAge: 0, // Disable the freshness check,
    // To avoid querying the database for every getSession() call
    cookieCache: {
      enabled: true,
      maxAge: minutesToSeconds(5),
    },
  },
  // Hooks to run custom logic at various points in the auth flow
  hooks,
  // Rate limit requests from the same IP address to prevent brute force attacks
  rateLimit: {
    // Limit to 100 requests per minute
    window: minutesToSeconds(1),
    max: 100,
    // More sensitive paths have stricter limits
    customRules: {
      '/sign-in/email': {
        // 3 requests per 10 seconds
        window: 10,
        max: 3,
      },
    },
  },
  plugins: [organization({ sendInvitationEmail }), tanstackStartCookies()],
  logger: {
    log: (level, message, ...args) => {
      if (level === 'error') {
        logger.error(args, message);
      } else if (level === 'warn') {
        logger.warn(args, message);
      } else if (level === 'info') {
        logger.info(args, message);
      } else {
        logger.debug(args, message);
      }
    },
  },
  telemetry: {
    enabled: false,
  },
});

export type Session = typeof auth.$Infer.Session;

export type Organization = typeof auth.$Infer.Organization;

export type Member = typeof auth.$Infer.Member;

export type Invitation = typeof auth.$Infer.Invitation;

export type UserSettings = {
  activeOrganizationId?: string;
  darkMode?: boolean;
  navbarCollapsed?: boolean;
};

export type User = Omit<typeof auth.$Infer.Session.user, 'settings'> & {
  settings?: UserSettings | null;
};
