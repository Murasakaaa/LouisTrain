"use server";
// import "server-only";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const secretKey = process.env.SESSION_SECRET;
const encodedKey = new TextEncoder().encode(secretKey);

export async function createSession(userId: string) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7j
  const session = await encrypt({ userId, expiresAt });

  const cookieStore = await cookies();

  cookieStore.set("session", session, {
    httpOnly: true, // empeche le JS de lire le cookie et donc de voler la session
    secure: true, // le cookie n'est que avec HTTPS
    expires: expiresAt, // date d'expiration du cookie
    sameSite: "lax", // protection contre les sites tiers
    path: "/", // rend le cookie dispo sur tout le site
  });
}

export async function deleteSession() {
  console.log("session supp");
  const cookieStore = await cookies();
  cookieStore.delete("session");
}

type SessionPayload = {
  userId: string;
  expiresAt: Date | number;
};

export async function encrypt(payload: SessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(encodedKey);
}

export async function decrypt(session: string | undefined = "") {
  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ["HS256"],
    });
    return payload;
  } catch (error) {
    //console.log("Failed to verify session");
  }
}

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;

  if (!session) return null;

  const payload = await decrypt(session);

  if (!payload?.userId) return null;

  return {
    userId: payload.userId,
  };
}
