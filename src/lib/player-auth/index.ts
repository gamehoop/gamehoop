import { db } from '@/db';
import {
  daysToSeconds,
  hoursToSeconds,
  minutesToSeconds,
} from '@/utils/datetime';
import { betterAuth } from 'better-auth';
import { anonymous } from 'better-auth/plugins';
import {
  sendChangeEmailConfirmation,
  sendDeleteAccountVerification,
  sendResetPassword,
  sendVerificationEmail,
} from '../auth/emails';
import { logger } from '../logger';
import { createHooks } from './hooks';

export function createPlayerAuth(gameId: number) {
  return betterAuth({
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
      requireEmailVerification: false,
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
      sendOnSignUp: false,
      // Automatically sign in after the email is verified
      autoSignInAfterVerification: true,
      // To send the verification email
      sendVerificationEmail,
    },
    account: {
      modelName: 'player_account',
    },
    user: {
      modelName: 'player_user',
      // Additional columns to add to the user database table
      additionalFields: {
        gameId: {
          type: 'number',
          required: true,
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
      modelName: 'player_session',
      // Expire a session in 7 days
      expiresIn: daysToSeconds(7),
      // Refresh a session every 1 day
      updateAge: daysToSeconds(1),
      // Some operations require a fresh session.
      // Consider a session fresh if it is less than 12 hours old
      // freshAge: hoursToSeconds(12),
      freshAge: 0, // Disable the freshness check,
      // To avoid querying the database for every getSession() call
      cookieCache: {
        enabled: true,
        maxAge: minutesToSeconds(5),
      },
    },
    // Hooks to run custom logic at various points in the auth flow
    hooks: createHooks(gameId),
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
    plugins: [anonymous()],
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
}
