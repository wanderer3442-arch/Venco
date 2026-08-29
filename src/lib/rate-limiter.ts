/**
 * rate-limiter.ts
 * Client-side rate limiting and account lockout for login attempts.
 * Uses sessionStorage (cleared on tab close) to track failed attempts.
 */

const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes
const STORAGE_KEY_PREFIX = 'gymathome_ratelimit_';

interface AttemptRecord {
  count: number;
  lockedUntil: number | null; // Unix timestamp in ms, or null if not locked
  lastAttempt: number;        // Unix timestamp in ms
}

function getKey(identifier: string): string {
  // Normalize to lowercase to prevent bypassing via case variation
  return `${STORAGE_KEY_PREFIX}${identifier.toLowerCase().trim()}`;
}

function getRecord(identifier: string): AttemptRecord {
  try {
    const raw = sessionStorage.getItem(getKey(identifier));
    if (!raw) return { count: 0, lockedUntil: null, lastAttempt: 0 };
    return JSON.parse(raw) as AttemptRecord;
  } catch {
    return { count: 0, lockedUntil: null, lastAttempt: 0 };
  }
}

function saveRecord(identifier: string, record: AttemptRecord): void {
  try {
    sessionStorage.setItem(getKey(identifier), JSON.stringify(record));
  } catch {
    // sessionStorage may be unavailable in some contexts — fail silently
  }
}

/**
 * Returns true if the given identifier (email or username) is currently locked out.
 */
export function isLockedOut(identifier: string): boolean {
  const record = getRecord(identifier);
  if (record.lockedUntil === null) return false;
  if (Date.now() < record.lockedUntil) return true;
  // Lockout has expired — clear it
  clearAttempts(identifier);
  return false;
}

/**
 * Returns the number of seconds remaining in the lockout,
 * or 0 if not locked out.
 */
export function getLockoutRemainingSeconds(identifier: string): number {
  const record = getRecord(identifier);
  if (record.lockedUntil === null) return 0;
  const remaining = record.lockedUntil - Date.now();
  return remaining > 0 ? Math.ceil(remaining / 1000) : 0;
}

/**
 * Returns the number of failed attempts remaining before lockout.
 */
export function getAttemptsRemaining(identifier: string): number {
  if (isLockedOut(identifier)) return 0;
  const record = getRecord(identifier);
  return Math.max(0, MAX_ATTEMPTS - record.count);
}

/**
 * Records a failed login attempt. Triggers lockout after MAX_ATTEMPTS.
 */
export function recordFailedAttempt(identifier: string): void {
  const record = getRecord(identifier);
  const newCount = record.count + 1;

  const updated: AttemptRecord = {
    count: newCount,
    lockedUntil: newCount >= MAX_ATTEMPTS ? Date.now() + LOCKOUT_DURATION_MS : null,
    lastAttempt: Date.now(),
  };

  saveRecord(identifier, updated);
}

/**
 * Clears all failed attempt records for the given identifier
 * (called on successful login).
 */
export function clearAttempts(identifier: string): void {
  try {
    sessionStorage.removeItem(getKey(identifier));
  } catch {
    // fail silently
  }
}

export { MAX_ATTEMPTS, LOCKOUT_DURATION_MS };
