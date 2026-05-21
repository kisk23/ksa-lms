# Admin Auth Audit

## Current Flow Before Fix

- Access tokens are issued by `POST /auth/login`, `POST /auth/register`, `POST /auth/verify-otp`, and `POST /auth/refresh`.
- Tokens are stored in `HttpOnly` cookies named `access_token` and `refresh_token`.
- The API `JwtStrategy` reads only the `access_token` cookie. It does not read `Authorization: Bearer`.
- Refresh uses the `refresh_token` cookie, checks it against stored bcrypt hashes, revokes the used token, and stores a new refresh token hash.
- The web app already uses cookie requests, one in-flight refresh promise, and one 401 retry.
- The admin app previously tried `localStorage.adminAccessToken`, so authenticated admin API calls were disconnected from the real backend cookie flow.

## Risks Found

- Admin token storage was a broken pattern because no admin access token is returned to JavaScript.
- Local storage bearer tokens would have been weaker than the existing `HttpOnly` cookie design.
- Admin routes were rendered under the dashboard layout without an auth gate, so protected pages could flash before a client check.
- There was no admin login page and no role check to reject student, parent, or teacher accounts.
- A naive refresh retry can race when multiple requests receive 401. The admin client now uses a shared refresh promise.
- Refresh endpoints must not retry themselves, otherwise a bad refresh token can create an infinite loop. The admin client excludes auth refresh/login/register from retry.
- Middleware cannot validate refresh tokens directly. If only a refresh cookie exists, the protected shell allows the page to load but withholds children until `/auth/me` succeeds after refresh.

## Implemented Direction

- Keep tokens in backend-managed `HttpOnly` cookies.
- Use same-origin admin API rewrites so browser requests send cookies naturally.
- Protect admin routes with middleware and a client auth shell.
- Redirect unauthenticated users to `/login?redirect=...`.
- Redirect authenticated admins away from `/login`.
- Reject non-admin accounts after login and logout their cookies.
- Preserve refresh rotation by refreshing once, retrying once, and expiring the session on refresh failure.
