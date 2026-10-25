import '@testing-library/jest-dom';
import { beforeAll, afterAll } from 'vitest';

beforeAll(() => {
  // Global test setup
  process.env.SESSION_SECRET = 'test-secret-at-least-32-characters-long!';
  process.env.DATABASE_URL = 'file:./dev.db';
});

afterAll(() => {
  // Teardown
});
