import { createNeonAuth } from '@neondatabase/auth/next/server';

// Validate env vars at runtime, not build time
function getAuthConfig() {
  if (!process.env.NEON_AUTH_BASE_URL) {
    throw new Error('NEON_AUTH_BASE_URL environment variable is not set');
  }
  if (!process.env.NEON_AUTH_COOKIE_SECRET) {
    throw new Error('NEON_AUTH_COOKIE_SECRET environment variable is not set');
  }
  return {
    baseUrl: process.env.NEON_AUTH_BASE_URL,
    cookies: {
      secret: process.env.NEON_AUTH_COOKIE_SECRET,
    },
  };
}

// Lazy initialization
let _auth: ReturnType<typeof createNeonAuth> | null = null;

export const auth = new Proxy({} as ReturnType<typeof createNeonAuth>, {
  get(_, prop) {
    if (!_auth) {
      _auth = createNeonAuth(getAuthConfig());
    }
    return _auth[prop as keyof typeof _auth];
  },
});
