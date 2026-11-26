# RosterEdge

RosterEdge is a web app for sports clubs to manage teams and staff, schedule matches, and view standings, calendar density, and financial reports. The app includes Spanish and English translations and can export reports to PDF.

## Local setup

Requirements: **Node.js 22** with npm, **JDK 21**, and **PostgreSQL 17** with `psql`. The backend includes a Maven wrapper. Start PostgreSQL and create a database and role with permission to create tables, sequences, and schemas. Use a disposable database for demos and tests.

From the repository root, start the API in one terminal. This example assumes a local PostgreSQL server on port `5432`:

```bash
export POSTGRES_DB=rosteredge_demo POSTGRES_PORT=5432 POSTGRES_USER=roster_local
read -rs -p 'Local PostgreSQL password: ' POSTGRES_PASSWORD; printf '\n'
export POSTGRES_PASSWORD
export SPRING_PROFILES_ACTIVE=dev
cd backend
./mvnw spring-boot:run -Dspring-boot.run.arguments=--server.address=127.0.0.1
```

The API is available at `http://127.0.0.1:8081/api`; `GET /api/health/` is public. Flyway applies the migrations automatically. A new database has no accounts or catalog entries until you provision them or import the demo.

In a second terminal:

```bash
cd frontend
npm ci
VITE_BACKEND_URL=http://127.0.0.1:8081/api npm run dev -- --host 127.0.0.1 --port 5173 --strictPort
```

Open `http://127.0.0.1:5173`. For a built frontend, set `VITE_BACKEND_URL` when running `npm run build` (not at preview time), then run `npm run preview -- --host 127.0.0.1 --port 5173 --strictPort`. The API CORS allowlist includes the loopback URL shown above; for a deployment, use a same-origin reverse proxy or configure the allowed frontend origin in `CorsConfig`.

| Variable | Purpose |
| --- | --- |
| `POSTGRES_DB`, `POSTGRES_PORT` | Database and local port (`roster_db` and `5431` by default). |
| `POSTGRES_USER`, `POSTGRES_PASSWORD` | Database credentials. |
| `SPRING_DATASOURCE_URL` | Optional override for the JDBC URL; the default targets `localhost`. |
| `SPRING_PROFILES_ACTIVE` | Set to `dev` or `test` only for local development or tests. |
| `SECURITY_TOKEN_SECRET` | Outside `dev`/`test`, required: use a cryptographically random value at least 32 bytes long in UTF-8. For example, generate 32 random bytes with `openssl rand -hex 32` and inject the result as a secret. A missing secret in the local profiles generates an ephemeral key. |
| `SECURITY_TOKEN_EXPIRATION` | Bearer token lifetime in seconds, default `3600`. |
| `VITE_BACKEND_URL` | Required frontend API base URL, including `/api` and without a trailing slash. This value is public; do not put secrets in Vite variables. |

### Optional synthetic demo

After the API has migrated an empty local demo database, run this from the repository root with the same database environment:

```bash
PGPASSWORD="$POSTGRES_PASSWORD" psql -X -h 127.0.0.1 -p "$POSTGRES_PORT" \
  -U "$POSTGRES_USER" -d "$POSTGRES_DB" -f docs/testing/demo.sql
```

Sign in as `roster@example.invalid` with `RosterDemo-only!21`. The fixture includes two fictional clubs, generated IDs, teams, staff roles, completed and unplayed matches, and sample payments. It refuses to import into a schema containing clubs or roster accounts. **Never import this public fixture in production**; the application does not seed it at startup.

In **Partidos**, choose **Registrar resultado** next to an active fixture with both teams assigned. Enter whole, non-negative numbers for **Goles local** and **Goles visitante**, including an explicit `0` for a team that did not score. **Guardar resultado** finalizes the score and refreshes the fixtures and standings. Use **Editar resultado** to correct a saved score. The form uses `PUT /api/matches/{id}/result/`; only a signed-in roster account for the owning club can use it. The read-only staff-role catalog remains separate; those roles can still be selected when managing club staff.

## Verification

With the database variables set as above, point `POSTGRES_DB` to a separate disposable test database, then run:

```bash
(cd backend && SPRING_PROFILES_ACTIVE=test ./mvnw -B verify)
(cd frontend && npm ci && NODE_OPTIONS=--no-experimental-webstorage npm run test -- --run)
(cd frontend && npm run lint)
(cd frontend && VITE_BACKEND_URL=http://127.0.0.1:8081/api npm run build)
```

The backend suite uses PostgreSQL, including empty-schema and restart checks, authorization, transaction rollback, and report correctness. The frontend suite uses Vitest and Testing Library. CI on pushes and pull requests targeting `main` runs both suites, builds the frontend, and runs a [Chromium smoke against the packaged API and built frontend](docs/testing/README.md).

## Architecture

- **Frontend (`frontend/`)**: React and TypeScript, Vite, React Router for guarded, lazy-loaded routes, TanStack Query for API data, Recharts for charts, and React PDF for exports. Report charts load with their routes; PDF code loads only when you choose **Exportar PDF**. Match form dates are kept as calendar dates rather than converted through UTC.
- **Backend (`backend/`)**: Spring Boot REST and Spring Data JDBC. The API derives club scope from the roster session rather than trusting client filters. Passwords are hashed with PBKDF2, and active bearer sessions are tracked in memory; logging out revokes the current token and restarting invalidates active sessions.
- **PostgreSQL**: Flyway owns the schema. Match and assignment writes, including notification records, are transactional. A result is stored explicitly, so an unplayed fixture never counts as a 0–0 draw in standings.

## License

RosterEdge is licensed under the [MIT License](LICENSE).
