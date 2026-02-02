# Authentication Flow

## User Journey

### New User (First Sign-Up)
1. User visits `/` (landing page)
2. Clicks "Start Growing" → `/auth/sign-up`
3. Signs up with Google (via NeonAuth)
4. **Redirected to `/tasks`** (via `redirectTo` prop)
5. Proxy checks auth → ✅ Authenticated
6. App handler (`app/(app)/page.tsx`) checks onboarding status
7. **Redirected to `/onboarding`** (first-time user)
8. Completes onboarding
9. **Redirected to `/tasks/new`** to create first task

### Returning User
1. User visits `/` (landing page)
2. **Immediately redirected to `/tasks`** (auth check in landing page)
3. App handler checks onboarding status → ✅ Completed
4. **Redirected to `/tasks`** (main dashboard)

### Already Logged-In User
1. User visits `/auth/sign-in` or `/auth/sign-up`
2. **Immediately redirected to `/tasks`** (session check in auth pages)

## Protected Routes

All routes under `/tasks` and `/account` are protected by `proxy.ts`:
- Unauthenticated users → redirected to `/auth/sign-in`
- Authenticated users → allowed through

## Key Components

| File | Purpose |
|------|---------|
| `app/page.tsx` | Landing page - redirects authenticated users to `/tasks` |
| `app/(auth)/auth/[path]/page.tsx` | Auth pages - redirects authenticated users to `/tasks` |
| `app/(app)/page.tsx` | App entry - handles onboarding redirect |
| `proxy.ts` | Auth middleware - protects routes |
| `app/layout.tsx` | Root layout - wraps app with NeonAuthUIProvider |

## Environment Variables

```env
NEON_AUTH_BASE_URL=https://ep-xxx.neonauth.us-east-1.aws.neon.tech/neondb/auth
NEON_AUTH_COOKIE_SECRET=your-secret-at-least-32-characters-long
```

## NeonAuth Configuration

```typescript
// app/layout.tsx
<NeonAuthUIProvider
  authClient={authClient}
  redirectTo="/tasks"  // Where to go after successful auth
  social={{ providers: ["google"] }}
>
```

## Session Management

- **Client-side**: `authClient.useSession()` (from `lib/auth/client.ts`)
- **Server-side**: `auth.getSession()` (from `lib/auth/server.ts`)
- **User Button**: `<UserButton />` from NeonAuth (in app header)

## Sign Out

Users can sign out via:
- User button in header → Sign out option
- Direct visit to `/auth/sign-out`

After sign-out, users are redirected to `/` (landing page).
