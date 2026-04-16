---
name: Cloud Sync Architecture
description: Lovable Cloud dramas table with localStorage fallback, fire-and-forget sync
type: feature
---
- Database table `dramas` stores all drama data per user (RLS enforced)
- `store.ts` writes to localStorage AND fires async cloud sync
- On login, `CloudSync` component fetches cloud data and overwrites localStorage
- Auth: Email/Password + Google OAuth via lovable.auth.signInWithOAuth
- All routes protected via `ProtectedRoute` wrapper
