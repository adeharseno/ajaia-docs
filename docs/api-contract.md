# API Contract

Next.js API routes. JSON in/out. Auth = a simple cookie with the user id.

## Auth
- `POST /api/auth/login` — body `{ email }` → sets cookie, returns user
- `POST /api/auth/logout` — clears cookie
- `GET /api/auth/me` — returns current user or 401

## Documents
- `GET /api/documents` → `{ owned: [...], shared: [...] }`
- `POST /api/documents` → creates a new empty document
- `GET /api/documents/:id` → document content (403 if no access, 404 if not found)
- `PATCH /api/documents/:id` — body `{ title?, content? }` → updates it (used for autosave + rename)
- `DELETE /api/documents/:id` — owner only

## Sharing
- `POST /api/documents/:id/share` — body `{ email }` — owner only, grants access
- `DELETE /api/documents/:id/share/:userId` — owner only, revokes access

## File Upload
- `POST /api/documents/import` — multipart, field `file` (.txt/.md, max 1MB)
  → creates a new document from the file content

## Errors
Always `{ "error": "message" }`. Status codes: 400 bad input, 401 not
logged in, 403 no access, 404 not found, 409 conflict (e.g. already
shared), 500 server error.
