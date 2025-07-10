// gnereate random uuid
import { v7 as uuidv7 } from 'uuid';

/**
 * Generates a random UUID (version 7).
 *
 * UUIDv7 is a time-ordered UUID designed for improved database performance
 * and is useful for distributed systems where sortability is desired.
 *
 * @function generateUUID
 * @returns {string} A UUID v7 string.
 *
 * @example
 * const id = generateUUID();
 * console.log(id); // '018e56c4-395f-7cc0-a0df-f5b9e6c6b8b3'
 */
export const generateUUID = (): string => uuidv7();
