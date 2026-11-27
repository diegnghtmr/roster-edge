# API, staff roles, and club scoping

The Spring Boot REST API runs under `/api` and uses JSON except for PDF downloads. The routes below show the trailing slashes used by the app.

| Method and path | Purpose | Access |
| --- | --- | --- |
| `GET /api/health/` | Check the API status | Public |
| `GET /api/health/version/` | Read version information | Public |
| `POST /api/roster/login/` | Sign in with roster account email and password | Public |
| `GET /api/roster/me/` | Read the current roster account and club | Roster session |
| `POST /api/roster/logout/` | Revoke the current token | Roster session |
| `GET /api/staff-roles/` | List the shared staff role catalog | Roster session, read-only |
| `GET /api/matches/schedule/` | Read the club's fixture schedule | Owning club |
| `PUT /api/matches/{id}/result/` | Record or replace the fixture's final score | Owning club |
| `GET /api/analytics/reports/season-standings/` | Read season standings for the current club | Owning club |
| `GET /api/analytics/reports/schedule-density/` | Read schedule density for the current club | Owning club |
| `GET /api/analytics/reports/payment-method-performance/` | Read payment-method performance for the current club | Owning club |
| `GET /api/analytics/reports/{report}/pdf/` | Download the current club's report as a PDF | Owning club |

## Sessions and access

Use `Authorization: Bearer <your-session-token>` for authenticated requests. Roster passwords are hashed with PBKDF2. The server tracks active bearer sessions in memory: logging out revokes the current token, and restarting the API requires signing in again. See [configuration](configuration.md) for signing and expiry settings.

A staff role describes a staff record; it does not grant API access. Signed-in roster accounts can look up shared roles when managing their club's staff, but cannot edit the shared catalog. The server derives club scope from the roster session, not from client-supplied filters, and checks ownership of both addressed records and references in writes. Missing or invalid sessions receive `401`; out-of-scope records are not disclosed. The [authorization policy](../backend/src/main/java/co/edu/uniquindio/rosteredge/backend/security/RosterAuthorization.java) is the source of truth for accessible resources.

## Downloading a report PDF

Append `pdf/` to the report data endpoint and pass the same query filters. For example, `GET /api/analytics/reports/season-standings/pdf/?seasonId=42` returns the standings for season 42 if that season belongs to the current club.

Supported report slugs: `roster-profile`, `season-agenda`, `match-load`, `scoring-ranking`, `staff-ratio`, `points-progress`, `category-participation`, `season-standings`, `schedule-density`, `staff-impact`, `payment-method-performance`, and `subscription-plan-performance`.

With a valid roster session, the server returns `200 OK`, `Content-Type: application/pdf`, `Content-Disposition: attachment; filename="<report>.pdf"`, and `Cache-Control: no-store`. Club scope comes from the session, even if a different `clubId` is supplied; filters cannot return another club's records. Missing or invalid sessions receive `401` and no PDF.

## Recording a result

The result endpoint accepts a JSON body with both `homeScore` and `awayScore` as non-negative integers. A scoreless draw must send both zeroes explicitly:

```json
{"homeScore": 0, "awayScore": 0}
```

The fixture must be active with exactly one active home assignment and one active away assignment for different teams. Sending another result updates the recorded score. Scheduling alone does not record a result or award standings points. An unplayed fixture and a recorded 0–0 draw are distinct states.

For the browser workflow, see [Try the result form](database.md#try-the-result-form).
