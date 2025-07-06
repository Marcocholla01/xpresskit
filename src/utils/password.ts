// utils/password.ts
import { randomBytes, scrypt, timingSafeEqual } from 'crypto';
import { promisify } from 'util';

import { ERROR_CODES } from '@/config/constants';
import type { ComparePasswordResult } from '@/types/auth.types';

import { appError } from './appError';

// Password should have: 1 uppercase, 1 lowercase, 1 number, 1 special char, 8–24 length
const passwordRegex = /^(?=.*[!@#$%^&*()_+])(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,24}$/;

/**
 * Generates a secure random password that matches the password policy.
 */
export const generateRandomPassword = (): string => {
  const characters = '!@#$%^&*()_+abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';

  let password = '';
  while (!passwordRegex.test(password)) {
    password = Array.from({ length: 12 }, () => {
      const randomIndex = Math.floor(Math.random() * characters.length);
      return characters[randomIndex];
    }).join('');
  }

  return password;
};

const scryptAsync = promisify(scrypt);

const KEY_LENGTH = 64; // Length of derived key in bytes
const SALT_LENGTH = 16; // 128-bit
const HASH_VERSION = 'v1'; // or 'scrypt-v1'
const ALGORITHM = 'scrypt'; // for future algorithm support

/**
 * Hashes a password using Node.js built-in scrypt algorithm.
 * @param password - Plain text password
 * @returns A string containing algorith, version, salt and derived key, separated by $
 */
export const hashPassword = async (password: string,): Promise<string> => {
  const salt = randomBytes(SALT_LENGTH).toString('hex');
  const derivedKey = (await scryptAsync(password, salt, KEY_LENGTH)) as Buffer;

  // Format: $algorithm$v1$salt$hash
  return `$${ALGORITHM}$${HASH_VERSION}$${salt}$${derivedKey.toString('hex')}`;
};

/**
 * Compares a plain password with a hashed one using timing-safe comparison.
 * @param plain - User input password
 * @param stored - Stored hashed password in "$algorithm$version$salt$hash" format
 */

export const comparePassword = async (
  plain: string,
  stored: string
): Promise<ComparePasswordResult> => {
  const parts = stored.split('$');
  const [_, algo, version, salt, storedKeyHex] = parts;

  if (parts.length !== 5) {
    throw new appError(
      `Unsupported hash version or algorithm: ${algo}-${version}`,
      409,
      ERROR_CODES.INVALID_HASH
    );
  }

  if (algo !== ALGORITHM || version !== HASH_VERSION) {
    // Either a different algorithm or outdated version
    const derivedKey = (await scryptAsync(plain, salt!, KEY_LENGTH)) as Buffer;
    const storedKey = Buffer.from(storedKeyHex!, 'hex');
    const isValid = timingSafeEqual(derivedKey, storedKey);
    return {
      isValid,
      needsRehash: isValid, // If valid but version is old → rehash
    };
  }

  const derivedKey = (await scryptAsync(plain, salt!, KEY_LENGTH)) as Buffer;
  const storedKey = Buffer.from(storedKeyHex!, 'hex');
  const isValid = timingSafeEqual(derivedKey, storedKey);

  return {
    isValid,
    needsRehash: false,
  };
};

// export const comparePassword = async (plain: string, stored: string): Promise<boolean> => {
//   const [_, algo, version, salt, storedKeyHex] = stored.split('$');

//   if (algo !== 'scrypt' || version !== 'v1') {
//     throw new Error(`Unsupported hash version or algorithm: ${algo}-${version}`);
//   }

//   const derivedKey = (await scryptAsync(plain, salt!, KEY_LENGTH)) as Buffer;
//   const storedKey = Buffer.from(storedKeyHex!, 'hex');

//   return timingSafeEqual(derivedKey, storedKey);
// };
