/**
 * crypto-utils.ts
 * Password hashing and verification using the native Web Crypto API (PBKDF2).
 * No external dependencies — uses browser-native `crypto.subtle`.
 */

const PBKDF2_ITERATIONS = 310_000; // OWASP recommended minimum for PBKDF2-HMAC-SHA256
const SALT_LENGTH = 16; // bytes
const KEY_LENGTH = 32; // bytes (256 bits)
const ALGORITHM = 'PBKDF2';
const DIGEST = 'SHA-256';

// ─── Encoding helpers ─────────────────────────────────────────────────────────

function bufferToHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

function hexToBuffer(hex: string): ArrayBuffer {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substring(i, 2), 16);
  }
  return bytes.buffer;
}

function hexToUint8Array(hex: string): Uint8Array<ArrayBuffer> {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.slice(i, i + 2), 16);
  }
  return bytes as Uint8Array<ArrayBuffer>;
}

// ─── Core API ────────────────────────────────────────────────────────────────

/**
 * Hash a password using PBKDF2-HMAC-SHA256.
 * Returns a string in the format: `iterations:saltHex:hashHex`
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(SALT_LENGTH));
  const encoder = new TextEncoder();

  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    ALGORITHM,
    false,
    ['deriveBits']
  );

  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: ALGORITHM,
      salt,
      iterations: PBKDF2_ITERATIONS,
      hash: DIGEST,
    },
    keyMaterial,
    KEY_LENGTH * 8
  );

  const saltHex = bufferToHex(salt.buffer);
  const hashHex = bufferToHex(derivedBits);

  return `${PBKDF2_ITERATIONS}:${saltHex}:${hashHex}`;
}

/**
 * Verify a plain-text password against a stored PBKDF2 hash.
 * Uses constant-time comparison via `crypto.subtle` to prevent timing attacks.
 */
export async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  try {
    const parts = storedHash.split(':');
    if (parts.length !== 3) return false;

    const [iterStr, saltHex, expectedHashHex] = parts;
    const iterations = parseInt(iterStr, 10);
    if (isNaN(iterations) || iterations < 1) return false;

    const salt = hexToUint8Array(saltHex);
    const encoder = new TextEncoder();

    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      encoder.encode(password),
      ALGORITHM,
      false,
      ['deriveBits']
    );

    const derivedBits = await crypto.subtle.deriveBits(
      {
        name: ALGORITHM,
        salt,
        iterations,
        hash: DIGEST,
      },
      keyMaterial,
      KEY_LENGTH * 8
    );

    const actualHashHex = bufferToHex(derivedBits);

    // Constant-time comparison to prevent timing attacks
    if (actualHashHex.length !== expectedHashHex.length) return false;
    let diff = 0;
    for (let i = 0; i < actualHashHex.length; i++) {
      diff |= actualHashHex.charCodeAt(i) ^ expectedHashHex.charCodeAt(i);
    }
    return diff === 0;
  } catch {
    return false;
  }
}

/**
 * Returns true if the given string looks like a PBKDF2 hash
 * (i.e., was produced by `hashPassword`).
 * Used to detect legacy plain-text passwords for migration.
 */
export function isHashedPassword(value: string): boolean {
  const parts = value.split(':');
  if (parts.length !== 3) return false;
  const iterations = parseInt(parts[0], 10);
  return !isNaN(iterations) && iterations > 0 && parts[1].length === SALT_LENGTH * 2 && parts[2].length === KEY_LENGTH * 2;
}
