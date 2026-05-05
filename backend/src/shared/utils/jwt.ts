import { createHmac, timingSafeEqual } from 'crypto';

export interface JwtPayload {
  sub: number;       // user id
  username: string;
  rol: string;
  iat: number;
  exp: number;
}

/**
 * Signs a JWT using HMAC-SHA256 (HS256).
 * @param payload  User data to embed (without iat/exp).
 * @param secret   Signing secret read from environment.
 * @param expiresInSeconds  Token lifetime in seconds (default 24 h).
 */
export function signJWT(
  payload: Omit<JwtPayload, 'iat' | 'exp'>,
  secret: string,
  expiresInSeconds: number = 86400,
): string {
  const header = { alg: 'HS256', typ: 'JWT' };
  const now = Math.floor(Date.now() / 1000);
  const claims: JwtPayload = { ...payload, iat: now, exp: now + expiresInSeconds };

  const encodedHeader = Buffer.from(JSON.stringify(header)).toString('base64url');
  const encodedPayload = Buffer.from(JSON.stringify(claims)).toString('base64url');
  const signingInput = `${encodedHeader}.${encodedPayload}`;
  const signature = createHmac('sha256', secret).update(signingInput).digest('base64url');

  return `${signingInput}.${signature}`;
}

/**
 * Verifies a JWT signature and checks expiry.
 * Returns the decoded payload on success, null otherwise.
 */
export function verifyJWT(token: string, secret: string): JwtPayload | null {
  const parts = token.split('.');
  if (parts.length !== 3) return null;

  const [encodedHeader, encodedPayload, signature] = parts as [string, string, string];
  const signingInput = `${encodedHeader}.${encodedPayload}`;
  const expectedSig = createHmac('sha256', secret).update(signingInput).digest('base64url');

  // Constant-time comparison to prevent timing attacks
  try {
    const sigBuffer = Buffer.from(signature, 'base64url');
    const expectedBuffer = Buffer.from(expectedSig, 'base64url');
    if (sigBuffer.length !== expectedBuffer.length) return null;
    if (!timingSafeEqual(sigBuffer, expectedBuffer)) return null;
  } catch {
    return null;
  }

  let payload: JwtPayload;
  try {
    payload = JSON.parse(Buffer.from(encodedPayload, 'base64url').toString('utf-8'));
  } catch {
    return null;
  }

  if (!payload.exp || payload.exp < Math.floor(Date.now() / 1000)) return null;

  return payload;
}
