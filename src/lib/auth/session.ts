import { compare, hash } from 'bcryptjs';
import { SignJWT, jwtVerify } from 'jose';
import { serialize, parse } from 'cookie';
import { NewUser } from '@/lib/db/schema';

const key = new TextEncoder().encode(process.env.AUTH_SECRET);
const SALT_ROUNDS = 10;
const COOKIE_NAME = 'session';

export async function hashPassword(password: string) {
  return hash(password, SALT_ROUNDS);
}

export async function comparePasswords(
  plainTextPassword: string,
  hashedPassword: string
) {
  return compare(plainTextPassword, hashedPassword);
}

type SessionData = {
  user: { id: number };
  expires: string;
};

export async function signToken(payload: SessionData) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('1 day from now')
    .sign(key);
}

export async function verifyToken(input: string) {
  try {
    const { payload } = await jwtVerify(input, key, {
      algorithms: ['HS256'],
    });
    return payload as SessionData;
  } catch (error) {
    console.error("Token verification failed:", error);
    return null;
  }
}

export async function getSession(cookieHeader?: string | null | undefined): Promise<SessionData | null> {
  if (!cookieHeader) {
    return null;
  }

  const parsed = parse(cookieHeader);
  const session = parsed[COOKIE_NAME];

  if (!session) {
    return null;
  }

  return await verifyToken(session);
}

export async function setSession(user: NewUser, res: { setHeader: (name: string, value: string) => void }) {
  const expiresInOneDay = new Date(Date.now() + 24 * 60 * 60 * 1000);
  const sessionData: SessionData = {
    user: { id: user.id! },
    expires: expiresInOneDay.toISOString(),
  };

  const encryptedSession = await signToken(sessionData);

  const serializedCookie = serialize(COOKIE_NAME, encryptedSession, {
    expires: expiresInOneDay,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  });

  res.setHeader('Set-Cookie', serializedCookie);
}

export async function deleteSession(res: { setHeader: (name: string, value: string) => void }) {
  const serializedCookie = serialize(COOKIE_NAME, '', {
    maxAge: -1,
    path: '/',
  });

  res.setHeader('Set-Cookie', serializedCookie);
}
