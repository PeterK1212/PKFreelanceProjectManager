# Postman — Freelance Project Manager API

Files:
- `FreelanceProjectManager.postman_collection.json` — all backend endpoints (Auth, Projects, Tasks, Admin)
- `local.postman_environment.json` — points at the local server (`http://localhost:5001`)
- `test.postman_environment.json` — points at the test/deployed server

## Setup
1. In Postman: **Import** the collection and both environment files.
2. Select an environment (top-right): **FPM - Local** or **FPM - Test**.
3. Start the backend if testing locally: `cd backend && npm start` (needs `backend/.env` with `MONGO_URI`, `JWT_SECRET`, `PORT=5001`).

## Run order
Tokens and ids are captured automatically into collection variables:
1. **Auth → Register (User)** and **Register (Admin)** — first run only (returns 400 if the accounts already exist; that's fine).
2. **Auth → Login (User)** → stores `token`. **Login (Admin)** → stores `adminToken`.
3. **Projects → Create Project** → stores `projectId`; then Update / Delete reuse it.
4. **Tasks → Create Task** → stores `taskId`; then Update / Delete reuse it.
5. **Admin** requests use `adminToken`. The "forbidden for non-admin" request asserts a `403` using the freelancer `token` (verifies the Proxy/admin guard).

Negative tests covering the auth guards:
- **Auth → Get Profile (no token → 401)** — verifies the `protect` middleware rejects unauthenticated requests.
- **Admin → Get All Projects (forbidden for non-admin)** — verifies the `admin`/Proxy guard returns `403`.

You can also run the whole collection with the Collection Runner (run Auth first, or run the folders in order).

## Environment variables
| Variable | Purpose |
|---|---|
| `baseUrl` | API base URL |
| `userName` / `userEmail` / `userPassword` | Freelancer credentials (synthetic) |
| `adminEmail` / `adminPassword` | Admin credentials (synthetic) |
| `token` / `adminToken` | JWTs captured at login |
| `projectId` / `taskId` | Ids captured when creating |

## Notes
- Credentials in the environments are **synthetic placeholders** — change them to match accounts that exist in the target database.
- The **test** `baseUrl` is set to the public host from the project README (`http://3.26.196.206`). Confirm the deployed backend's actual host/port/path (the API runs on port `5001` locally) and adjust if needed.
