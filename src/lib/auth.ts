import { CompactEncrypt, SignJWT, compactDecrypt, jwtVerify } from 'jose';

const APP_PASSWORD = process.env['APP_PASSWORD'];
const JWT_KEY = process.env['JWT_KEY'];
const JWT_ISSUER = process.env['JWT_ISSUER'];
const JWT_AUDIENCE = process.env['JWT_AUDIENCE'];

if (!APP_PASSWORD) {
  throw new Error('APP_PASSWORD variable not set');
}

if (!JWT_KEY) {
  throw new Error('JWT_KEY variable not set');
}

if (!JWT_ISSUER) {
  throw new Error('JWT_ISSUER variable not set');
}

if (!JWT_AUDIENCE) {
  throw new Error('JWT_AUDIENCE variable not set');
}

export const COOKIE = JWT_AUDIENCE as string;

const secret = new TextEncoder().encode(JWT_KEY);

export async function authorize(password: string) {
  if (password !== APP_PASSWORD) {
    throw new Error('Invalid password');
  }

  const jwt = await new SignJWT()
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuer(`${JWT_ISSUER}`)
    .setAudience(`${JWT_AUDIENCE}`)
    .setIssuedAt()
    .setExpirationTime('1h')
    .sign(secret);

  const cookie = await new CompactEncrypt(new TextEncoder().encode(jwt))
    .setProtectedHeader({ alg: 'A256GCMKW', enc: 'A256GCM' })
    .encrypt(secret);

  return {
    jwt,
    cookie,
    details: await getJWTPayload(jwt),
  };
}

export async function getJWTPayload(token: string) {
  const { payload } = await jwtVerify(token, secret);

  if (!payload.iat || !payload.exp) {
    throw new Error('Something went wrong with token generation');
  }

  return { ...payload, iat: payload.iat * 1000, exp: payload.exp * 1000 };
}

export async function validateToken(token: string) {
  try {
    await jwtVerify(token, secret, {
      issuer: `${JWT_ISSUER}`,
      audience: `${JWT_AUDIENCE}`,
    });

    return true;
  } catch {
    return false;
  }
}

export async function validateCookie(cookie: string) {
  try {
    const { plaintext } = await compactDecrypt(cookie, secret);

    return validateToken(new TextDecoder().decode(plaintext));
  } catch {
    return false;
  }
}
