// src/lib/auth/index.ts
// A small wrapper that exposes a callable `auth()` which returns the server session.
// This avoids importing the NextAuth handler object (which is not callable).

import { getServerSession } from "next-auth/next";
import type { Session } from "next-auth";
import { authConfig } from "./auth-config";

/**
 * Returns the session object or null.
 * Use this from server-side contexts (server components, route handlers).
 */
export async function auth(): Promise<Session | null> {
  // `getServerSession` may accept different signatures depending on your NextAuth version.
  // If your project's getServerSession signature expects (req, res, options),
  // you'll need to adapt callers accordingly. This wrapper uses the "options-only"
  // signature which works in many server-component contexts.
  return await getServerSession(authConfig as any);
}

// Keep a default export as convenience
export default auth;
