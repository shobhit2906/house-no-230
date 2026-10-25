// @vitest-environment node
import { describe, it, expect } from 'vitest';
import {
  hashPassword,
  verifyPassword,
  createSessionToken,
  verifySessionToken,
  checkRateLimit,
} from '@/lib/auth';

describe('Authentication & Security', () => {
  it('correctly hashes and verifies passwords using bcrypt', async () => {
    const plain = 'SecurePass#2026';
    const hash = await hashPassword(plain);

    expect(hash).not.toBe(plain);
    const valid = await verifyPassword(plain, hash);
    expect(valid).toBe(true);

    const invalid = await verifyPassword('WrongPassword', hash);
    expect(invalid).toBe(false);
  });

  it('generates and verifies tamper-evident JWT sessions', async () => {
    const payload = {
      userId: 'usr-admin-1',
      email: 'admin@houseno230.com',
      name: 'Restaurant Admin',
      role: 'ADMIN' as const,
    };

    const token = await createSessionToken(payload);
    expect(token).toBeDefined();
    expect(typeof token).toBe('string');

    const decoded = await verifySessionToken(token);
    expect(decoded).not.toBeNull();
    expect(decoded?.email).toBe('admin@houseno230.com');
    expect(decoded?.role).toBe('ADMIN');

    // Invalid token check
    const badTokenResult = await verifySessionToken('invalid.token.signature');
    expect(badTokenResult).toBeNull();
  });

  it('enforces rate limiting correctly', () => {
    const key = `test-ip-${Date.now()}`;
    const limit = 3;
    const windowMs = 5000;

    const req1 = checkRateLimit(key, limit, windowMs);
    expect(req1.allowed).toBe(true);

    const req2 = checkRateLimit(key, limit, windowMs);
    expect(req2.allowed).toBe(true);

    const req3 = checkRateLimit(key, limit, windowMs);
    expect(req3.allowed).toBe(true);

    const req4 = checkRateLimit(key, limit, windowMs);
    expect(req4.allowed).toBe(false);
    expect(req4.remaining).toBe(0);
  });
});
