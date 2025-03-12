/**
 * NextAuth.js Authentication Configuration
 *
 * This file defines the core authentication configuration for the application,
 * including providers, session management, callbacks, and security settings.
 * It uses NextAuth.js with credentials-based authentication against our MongoDB database.
 */

import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import User from '@/models/User';
import { connectToDatabase } from '@/lib/databaseConnection';

// Session duration constants
const STANDARD_SESSION_DURATION = 4 * 60 * 60; // 4 hours in seconds
const REMEMBER_ME_SESSION_DURATION = 30 * 24 * 60 * 60; // 30 days in seconds

/**
 * NextAuth configuration options
 *
 * This object configures the entire authentication system including:
 * - Credential provider for username/password login
 * - Custom pages for login, logout, etc.
 * - JWT-based session handling with "remember me" functionality
 * - Security settings for cookies and tokens
 */
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        remember: { label: 'Remember Me', type: 'boolean' },
      },
      /**
       * Authorize user credentials against the database
       *
       * This function validates credentials, checks the user exists,
       * verifies the password hash, and handles "remember me" preferences.
       *
       * @param credentials - User-provided login credentials
       * @returns User object if authenticated, null if authentication fails
       */
      async authorize(credentials) {
        try {
          // Validate credentials format
          const parsedCredentials = z
            .object({
              email: z.string().email(),
              password: z.string().min(6),
              remember: z.string().optional(),
            })
            .safeParse(credentials);

          if (!parsedCredentials.success) {
            return null;
          }

          // Connect to database
          await connectToDatabase();

          // Find user by email
          const user = await User.findOne({ email: parsedCredentials.data.email });

          if (!user) {
            return null;
          }

          // Verify password
          const isPasswordValid = await bcrypt.compare(
            parsedCredentials.data.password,
            user.password
          );

          if (!isPasswordValid) {
            return null;
          }

          // Set session maxAge based on remember me preference
          const isRemembered = parsedCredentials.data.remember === 'true';

          // Return user object (without sensitive information)
          return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            image: user.image || null,
            remember: isRemembered,
          };
        } catch (error) {
          console.error('Auth error:', error);
          return null;
        }
      },
    }),
  ],

  // Custom pages for authentication flows
  pages: {
    signIn: '/auth/login',
    signOut: '/auth/logout',
    error: '/auth/error',
    newUser: '/auth/register',
  },

  // Session configuration (JWT-based)
  session: {
    strategy: 'jwt',
    maxAge: REMEMBER_ME_SESSION_DURATION, // Maximum duration
  },

  // Callbacks to customize token and session behavior
  callbacks: {
    /**
     * JWT callback for customizing the JWT token
     *
     * Handles "remember me" functionality by setting different
     * expiry durations based on user preference.
     */
    async jwt({ token, user, trigger }) {
      // Initialize the token
      if (user) {
        token.id = user.id;
        token.remember = user.remember;

        // For non-remembered sessions, set an expiry timestamp
        if (!user.remember) {
          token.sessionExpiry = Math.floor(Date.now() / 1000) + STANDARD_SESSION_DURATION;
        }
      }

      // For session updates, check if a non-remembered session is expired
      if (token.sessionExpiry && typeof token.sessionExpiry === 'number') {
        const currentTime = Math.floor(Date.now() / 1000);
        if (currentTime > token.sessionExpiry) {
          // Clear the token to force sign out
          return { expired: true };
        }
      }

      return token;
    },

    /**
     * Session callback for customizing the session object
     *
     * Handles expired sessions and adds user ID to the session.
     */
    async session({ session, token }) {
      // Check if token is marked as expired
      if (token.expired) {
        // Return the session but mark it in a way that client can detect expiry
        if (session.user) {
          session.user.id = '';
          session.expired = true;
        }
        return session;
      }

      // Normal session
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },

  // Cookie security settings
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
  },

  // Enable debug mode in development
  debug: process.env.NODE_ENV === 'development',
};
