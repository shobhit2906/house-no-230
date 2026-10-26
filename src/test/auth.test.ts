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

  it('fails safely in production when session secret is missing', async () => {
    const { getSecretKey } = await import('@/lib/auth');
    const envObj = process.env as Record<string, string | undefined>;
    const origNodeEnv = envObj.NODE_ENV;
    const origSessionSecret = envObj.SESSION_SECRET;
    const origJwtSecret = envObj.JWT_SECRET;

    try {
      // Simulate production environment with missing secrets
      envObj.NODE_ENV = 'production';
      delete envObj.SESSION_SECRET;
      delete envObj.JWT_SECRET;

      expect(() => getSecretKey()).toThrow(/SESSION_SECRET or JWT_SECRET must be configured/);
    } finally {
      envObj.NODE_ENV = origNodeEnv;
      if (origSessionSecret) envObj.SESSION_SECRET = origSessionSecret;
      if (origJwtSecret) envObj.JWT_SECRET = origJwtSecret;
    }
  });

  it('supports JWT_SECRET as backward-compatible fallback for SESSION_SECRET', async () => {
    const { getSecretKey } = await import('@/lib/auth');
    const origSessionSecret = process.env.SESSION_SECRET;
    const origJwtSecret = process.env.JWT_SECRET;

    try {
      delete process.env.SESSION_SECRET;
      process.env.JWT_SECRET = 'custom-jwt-secret-alias-for-session-testing!';

      const key = getSecretKey();
      expect(key).toBeInstanceOf(Uint8Array);
      expect(key.length).toBeGreaterThan(0);
    } finally {
      if (origSessionSecret) process.env.SESSION_SECRET = origSessionSecret;
      if (origJwtSecret) process.env.JWT_SECRET = origJwtSecret;
    }
  });
});
