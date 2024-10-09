import "server-only";

import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

type SessionPayload = {
  userId: string;
  expires: Date;
};

const secretKey = process.env.SESSION_SECRET;
const key = new TextEncoder().encode(secretKey);

// =========================================================================================================================================

export async function encrypt(payload: SessionPayload) {
  const expires = new Date(Date.now() + 2 * 3600 * 1000);
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(expires)
    .sign(key);
}

// =========================================================================================================================================

export async function decrypt(session: string | undefined = "") {
  const { payload } = await jwtVerify(session, key, {
    algorithms: ["HS256"],
  });
  if (!payload) return null;
  return payload as SessionPayload;
}

// =========================================================================================================================================

export async function getSession(): Promise<SessionPayload | null> {
  const session = cookies().get("session")?.value;
  if (!session) return null;
  return await decrypt(session);
}

// =========================================================================================================================================

export async function createSession(userId: string) {
  const expires = new Date(Date.now() + 2 * 3600 * 1000);
  const session = await encrypt({ userId, expires });

  cookies().set("session", session, {
    httpOnly: true,
    secure: true,
    expires,
    sameSite: "lax",
    path: "/",
  });
}

// =========================================================================================================================================

export const ensureAuthenticated = async () => {
  const session = await getSession();
  if (!session) {
    throw new Error("Vous devez être connecté pour effectuer une action.");
  }
  return session;
};

// =========================================================================================================================================

export async function updateSession() {
  const session = cookies().get("session")?.value;
  const payload = await decrypt(session);

  if (!session || !payload) {
    return null;
  }

  const expires = new Date(Date.now() + 2 * 3600 * 1000);
  cookies().set("session", session, {
    httpOnly: true,
    secure: true,
    expires: expires,
    sameSite: "lax",
    path: "/",
  });
}

// =========================================================================================================================================

export function deleteSession() {
  cookies().delete("session");
  redirect("/connexion");
}
