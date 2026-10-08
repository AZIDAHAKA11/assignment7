import { betterAuth } from 'better-auth';
import Database from 'better-sqlite3';
import path from 'path';

// Vercel file system read-only, so use /tmp in production
const dbPath =
  process.env.NODE_ENV === 'production'
    ? '/tmp/fitlog.db'
    : path.join(process.cwd(), 'fitlog.db');

export const auth = betterAuth({
  database: new Database(dbPath),
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
  },
  trustedOrigins: [
    'http://localhost:3000',
    process.env.BETTER_AUTH_URL || '',
  ].filter(Boolean),
});

export type Session = typeof auth.$Infer.Session;