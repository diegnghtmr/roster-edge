# Configuration

Start with the [quick start](../README.md#quick-start) for local development. The default API base is `http://127.0.0.1:8081/api` when bound to loopback.

| Variable | Purpose | Default |
| --- | --- | --- |
| `POSTGRES_DB` | PostgreSQL database name | `roster_db` |
| `POSTGRES_PORT` | PostgreSQL port in the default JDBC URL | `5431` |
| `POSTGRES_USER` | PostgreSQL role | Required |
| `POSTGRES_PASSWORD` | PostgreSQL role password | Required; enter it when prompted |
| `SPRING_DATASOURCE_URL` | Overrides the JDBC URL, including the host, port, and database | `jdbc:postgresql://localhost:${POSTGRES_PORT:5431}/${POSTGRES_DB:roster_db}` |
| `SPRING_PROFILES_ACTIVE` | Use `dev` for local development and `test` for tests; do not use either profile in deployment | No active profile |
| `SECURITY_TOKEN_SECRET` | Bearer-token signing secret; outside the local profiles, inject a cryptographically random value of at least 32 bytes in UTF-8 | Ephemeral only when omitted and only `dev` and/or `test` are active; otherwise required |
| `SECURITY_TOKEN_EXPIRATION` | Bearer-token lifetime in seconds; must be positive | `3600` |
| `VITE_BACKEND_URL` | Browser API base, including `/api` and no trailing slash | Required |

Generate a deployment signing secret with `openssl rand -hex 32` and inject the output as a secret. `VITE_BACKEND_URL` is public configuration: do not put secrets in Vite variables.

## Preview a production build

Set `VITE_BACKEND_URL` when building, not when starting the preview server. From `frontend/`, with dependencies installed and the API running:

```bash
VITE_BACKEND_URL=http://127.0.0.1:8081/api npm run build
npm run preview -- --host 127.0.0.1 --port 5173 --strictPort
```

The API CORS allowlist includes `http://127.0.0.1:5173`. For a deployment, use a same-origin reverse proxy or configure the allowed frontend origin in [`CorsConfig`](../backend/src/main/java/co/edu/uniquindio/rosteredge/backend/config/CorsConfig.java).
