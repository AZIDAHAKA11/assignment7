import { betterAuth } from 'better-auth';
import { Kysely } from 'kysely';
import { LibsqlDialect } from '@libsql/kysely-libsql';

// Turso (hosted SQLite) — works on Vercel
const db = new Kysely({
  dialect: new LibsqlDialect({
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN!,
  }),
});

export const auth = betterAuth({
  database: {
    db,
    type: 'sqlite',
  },
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
    'https://assignment7-teal.vercel.app',
  ],
});

export type Session = typeof auth.$Infer.Session;