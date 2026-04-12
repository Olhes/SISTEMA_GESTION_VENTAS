import crypto from 'crypto';

const SALT_LENGTH = 32;
const ITERATIONS = 10000;
const KEY_LENGTH = 64;
const ALGORITHM = 'sha512';

export function hash(password: string): string {
  const salt = crypto.randomBytes(SALT_LENGTH).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, ITERATIONS, KEY_LENGTH, ALGORITHM);
  return `${salt}:${hash.toString('hex')}`;
}

export function verify(password: string, hashedPassword: string): boolean {
  const [salt, hash] = hashedPassword.split(':');
  if (!salt || !hash) return false;
  
  const hashVerify = crypto.pbkdf2Sync(password, salt, ITERATIONS, KEY_LENGTH, ALGORITHM);
  return hashVerify.toString('hex') === hash;
}
