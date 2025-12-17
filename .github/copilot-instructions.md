# Copilot / AI Agent Instructions for PeachShadow

Quick context
- Frontend: React + TypeScript (Create React App / `react-scripts`) located at the repository root (`PeachShadow/`).
- Backend (API): separate Node/Express + Mongo project in `Katahdin/backend/` (sometimes called kachabazar server).

What to read first
- `src/config.ts` — canonical front-end API URL (`api.API_URL`) and social client keys.
- `src/helpers/api_helper.ts` — axios defaults, interceptors, and how auth tokens are applied.
- `src/index.tsx` — Redux store setup and `BrowserRouter` configuration (uses `process.env.PUBLIC_URL`).
- `Katahdin/backend/api/index.js` — where backend routes are mounted and middleware (notably `isAuth`) is applied.
- `Katahdin/backend/config/auth.js` — JWT signing, token lifetimes and encryption helper; also lists required env keys.

Big-picture architecture (short)
- Single-page React TypeScript front-end served from `PeachShadow/` (dev with `react-scripts start`, production built to `build/`).
- API is a separate Express app under `Katahdin/backend/` exposing REST endpoints under `/v1/*` (e.g. `/v1/products`, `/v1/order`).
- Front-end communicates with backend via axios. The front-end expects `api.API_URL` in `src/config.ts` to point at an API host.
- Authentication: backend issues JWTs; front-end stores an `authUser` JSON in `sessionStorage` that contains a `.token`. Axios uses `Authorization: Bearer <token>`.

Developer workflows & commands
- Front-end (dev):
  - Install: `cd PeachShadow && npm install`
  - Start dev server: `npm start` (runs `react-scripts start`).
  - Build for production: `npm run build` → outputs `build/`.
- Backend (dev):
  - Install: `cd Katahdin/backend && npm install`
  - Run dev server: `npm run dev` (runs `nodemon api/index.js`).
  - Run production: `npm start` (runs `node api/index.js`).
  - Import seed data: `npm run data:import` (runs `script/seed.js`).

Important environment variables (backend)
- Required keys (see `Katahdin/backend/.env.example` if present):
  - `MONGO_URI` / `Mongo_Uri` (database connection)
  - `JWT_SECRET`, `JWT_REFRESH_SECRET`, `JWT_SECRET_FOR_VERIFY`
  - `ENCRYPT_PASSWORD` (used by `handleEncryptData`)
  - Other provider keys (Stripe, PayPal, Twilio) live in envs if used

Project-specific patterns & conventions
- API base paths: routes are mounted under `/v1/...` — add new APIs following this prefix.
- Auth protection: routes that need authentication use `isAuth` (see `Katahdin/backend/config/auth.js`). When adding protected routes, ensure the front-end sends `Authorization: Bearer <token>`.
- Axios behavior: `src/helpers/api_helper.ts` uses an interceptor that returns `response.data` (so callers expect the API payload directly). It also normalizes errors to strings — prefer rejecting with the message rather than raw axios error objects.
- Token storage: front-end expects `sessionStorage.authUser` to be a JSON string; the token is at `JSON.parse(sessionStorage.getItem('authUser')).token`.
- Router basename: front-end uses `BrowserRouter basename={process.env.PUBLIC_URL}` — build/deploy may set `PUBLIC_URL` accordingly.

Examples (concrete)
- Fetch products (front-end GET): `GET ${api.API_URL}/v1/products` — see `src/helpers/api_helper.ts` and `Katahdin/backend/routes/productRoutes.js`.
- Protected review POST: front-end must send `Authorization` header; backend route uses `isAuth` middleware: `app.use('/v1/reviews/', isAuth, reviewRoutes)`.
- Changing the API target: edit `src/config.ts` `api.API_URL` or update the file before building if you need a different backend host for local testing.

When adding APIs or changing server contracts
- Update both sides: add a new `routes/*.js` and `controller/*.js` in the backend, mount it in `Katahdin/backend/api/index.js` under `/v1/...`.
- Update front-end API wrappers in `src/helpers/api_helper.ts` or add thin service functions (use `APIClient` class provided).
- Keep response shapes consistent: front-end expects payloads at the top-level of `response.data` because axios interceptor strips the wrapper.

Testing & debugging tips
- Backend logs authorization attempts in `isAuth` (`console.log('🔍isAuth ...')`). Use that as a quick checkpoint.
- To reproduce auth issues locally: run backend via `npm run dev`, run front-end via `npm start`, and ensure `src/config.ts` `api.API_URL` points at `http://localhost:5000` (or your port).
- Seed local DB with `npm run data:import` in `Katahdin/backend/` to populate sample data used by the UI.

Files to reference when making changes
- Front-end: `src/config.ts`, `src/helpers/api_helper.ts`, `src/index.tsx`, `src/slices/` (redux slices), `src/Routes/`.
- Backend: `Katahdin/backend/api/index.js`, `Katahdin/backend/config/auth.js`, `Katahdin/backend/routes/`, `Katahdin/backend/controller/`, `Katahdin/backend/models/`.

Safety and common gotchas
- The front-end `config.ts` is a TypeScript file—not environment variables—so changing API targets often requires editing the file or providing a build-time alternative.
- Socket.io integration is present but commented out in `api/index.js` — do not assume real-time features are active.
- The `auth.js` file expects valid env secrets; failing to set them results in auth errors.

If anything here is unclear or you want additional automation (scripts, env overrides, example requests), tell me which area to expand and I will iterate.
