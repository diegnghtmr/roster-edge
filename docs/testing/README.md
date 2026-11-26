# Packaged browser smoke

The smoke runs the Spring Boot JAR and Vite preview on loopback, applies Flyway to a new PostgreSQL schema, explicitly imports [`demo.sql`](demo.sql), then drives Chromium in `America/Bogota`. It leaves the parent PostgreSQL server running and stops the API, preview server, and browser on completion or failure. Every run prints its own `roster_smoke_*` schema name; keep these fixtures only in a disposable database. CI discards the whole PostgreSQL service after the job.

From the repository root, with Java 21, Node 22, `psql` and a local PostgreSQL 17 server, configure `POSTGRES_PORT`, `POSTGRES_USER`, and `POSTGRES_PASSWORD` as in the [quick start](../../README.md#quick-start). Create a disposable `rosteredge_smoke` database owned by the test role and run:

```bash
export POSTGRES_DB=rosteredge_smoke
(cd backend && SPRING_PROFILES_ACTIVE=test ./mvnw -B verify)
(cd frontend && npm ci && VITE_BACKEND_URL=http://127.0.0.1:8074/api npm run build)

pw_dir=$(mktemp -d)
npm install --prefix "$pw_dir" --ignore-scripts --no-audit --no-fund playwright@1.61.0
"$pw_dir/node_modules/.bin/playwright" install chromium
PW="$pw_dir/node_modules/playwright" node docs/testing/smoke.cjs
```

Ports `8074` and `5173` must be free. `PW` can point to an existing Playwright installation. Set `CHROMIUM_EXECUTABLE` to use an existing Chromium binary, or omit it to use Playwright's installed browser. On a Linux runner missing browser system libraries, use `playwright install --with-deps chromium`. Set `ROSTER_SHOTS_DIR` to an output directory outside the checkout for seven desktop captures (1440 × 900) and three mobile captures (390 × 844), including the result form at both sizes; CI does not save captures by default.

Checks cover login, signed-out deep links, team creation, Bogotá match dates, result recording through the match form, standings excluding unplayed fixtures, PDF export, the three club-scoped reports, the read-only staff-role catalog, profile reload, logout and token revocation, and mobile rendering. The imported identity and all the report data are synthetic. The separate Maven suite verifies authorization across clubs and verifies that Flyway migration order and constraints stay unchanged after restart.
