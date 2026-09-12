import { cookies } from "next/headers";
import crypto from "crypto";

const COOKIE_NAME = "kwetu_admin_session";
const COOKIE_MAX_AGE = 60 * 60 * 24; // 24h

function getSecret(): string {
  return process.env.ADMIN_PASSWORD ?? "kwetu-admin-2026";
}

/**
 * Crée un jeton de session signé (HMAC) à partir du mot de passe admin.
 * Pas de table de sessions : la vérification se fait en recalculant le HMAC.
 */
export function createSessionToken(): string {
  const payload = "kwetu-admin-session";
  const hmac = crypto.createHmac("sha256", getSecret()).update(payload).digest("hex");
  return `${payload}.${hmac}`;
}

export function verifySessionToken(token: string | undefined): boolean {
  if (!token) return false;
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return false;
  const expected = crypto.createHmac("sha256", getSecret()).update(payload).digest("hex");
  // comparaison en temps constant
  try {
    return crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected));
  } catch {
    return false;
  }
}

export async function setSessionCookie(): Promise<void> {
  const c = await cookies();
  c.set(COOKIE_NAME, createSessionToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: COOKIE_MAX_AGE,
    path: "/",
  });
}

export async function clearSessionCookie(): Promise<void> {
  const c = await cookies();
  c.delete(COOKIE_NAME);
}

export async function isAuthenticated(): Promise<boolean> {
  const c = await cookies();
  return verifySessionToken(c.get(COOKIE_NAME)?.value);
}
