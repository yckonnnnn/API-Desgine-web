import { createServerFn } from "@tanstack/react-start";

/**
 * The demo account, for local development and the live preview.
 *
 * Better Auth only accepts an email-shaped identifier, but this account is meant
 * to be typed as a bare name — `resolveAccountEmail` bridges the two, so `admin`
 * and `admin@fyt.local` reach the same user.
 */
export const DEMO_ACCOUNT = "admin";
export const DEMO_PASSWORD = "admin";
export const DEMO_EMAIL_DOMAIN = "fyt.local";

const DEMO_USER_ID = "demo-admin";

/** `admin` -> `admin@fyt.local`; anything already email-shaped is left alone. */
export function resolveAccountEmail(input: string): string {
  const value = input.trim();
  if (!value) return value;
  return value.includes("@") ? value : `${value}@${DEMO_EMAIL_DOMAIN}`;
}

export type DemoAdminResult =
  | { seeded: true; email: string }
  | { seeded: false; reason: "managed-database" | "already-present" };

/**
 * Create the demo account so `admin` / `admin` can sign in.
 *
 * Only runs against the embedded PGLite database — local dev and the live
 * preview, where no `DATABASE_URL` is configured. A real deployment never
 * receives this account, so a known-credentials login can't ship by accident.
 *
 * PGLite is in-memory and per-process, so this re-seeds after each restart and
 * is a single cheap `select` once the account exists.
 */
export const ensureDemoAdmin = createServerFn({ method: "POST" }).handler(
  async (): Promise<DemoAdminResult> => {
    const { dbSource, getSql } = await import("@/lib/db");
    if (dbSource !== "pglite") {
      return { seeded: false, reason: "managed-database" };
    }

    const sql = await getSql();
    const existing = await sql<{ id: string }>`
      select id from "user" where id = ${DEMO_USER_ID}
    `;
    if (existing.length) {
      return { seeded: false, reason: "already-present" };
    }

    const { hashPassword } = await import("better-auth/crypto");
    const password = await hashPassword(DEMO_PASSWORD);
    const email = `${DEMO_ACCOUNT}@${DEMO_EMAIL_DOMAIN}`;

    // `accountId` mirrors the user id — that pairing is what Better Auth's
    // email/password provider looks the credential row up by.
    await sql`
      insert into "user" (id, name, email, "emailVerified")
      values (${DEMO_USER_ID}, ${DEMO_ACCOUNT}, ${email}, true)
    `;
    await sql`
      insert into "account" (id, "accountId", "providerId", "userId", password, "updatedAt")
      values (
        ${"demo-admin-credential"},
        ${DEMO_USER_ID},
        'credential',
        ${DEMO_USER_ID},
        ${password},
        now()
      )
    `;

    return { seeded: true, email };
  },
);
