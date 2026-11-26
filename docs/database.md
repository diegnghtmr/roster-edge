# Database, migrations, and demo data

RosterEdge runs on PostgreSQL 17. Use a disposable database for local demos and a separate disposable database for tests.

## Schema and scheduling

Flyway applies and validates the [versioned migrations](../backend/src/main/resources/db/migration) on startup. The baseline can reconcile a pre-Flyway schema, and a later migration adds a sequence-sync function for controlled imports with explicit IDs: it advances sequences as needed without moving them backward. Spring SQL initialization is disabled, so a new database has no accounts or catalog entries until you provision them or import the demo.

The scheduling service commits the match, its home and away assignments, and the in-app notification together. A failure in an assignment or notification write rolls back the operation. The match form sends dates as calendar dates rather than converting through UTC. Results are stored explicitly so an unplayed fixture cannot become a 0–0 draw in the standings.

## Optional synthetic demo

After the API has migrated an empty local demo database, run this from the repository root with the same PostgreSQL variables you used in the [quick start](../README.md#quick-start):

```bash
PGPASSWORD="$POSTGRES_PASSWORD" psql -X -h 127.0.0.1 -p "$POSTGRES_PORT" \
  -U "$POSTGRES_USER" -d "$POSTGRES_DB" -f docs/testing/demo.sql
```

Sign in with `roster@example.invalid` and the fixture's local-only password (`<demo-password>`). The [fixture](testing/demo.sql) creates two fictional clubs with generated IDs, teams, staff roles, completed and unplayed matches, and sample payments. It refuses to import into a schema that already contains clubs or roster accounts. **Never import this public fixture into production.** The app does not seed it on startup.

## Try the result form

1. Open **Matches** (**Partidos**) and choose **Record result** (**Registrar resultado**) on an active fixture with both teams assigned.
2. Enter a whole, non-negative number in **Home goals** (**Goles local**) and **Away goals** (**Goles visitante**), including `0` for a team that did not score.
3. Choose **Save result** (**Guardar resultado**) to finalize the score and refresh fixtures and standings. Use **Edit result** (**Editar resultado**) to correct a saved score.

Only a signed-in roster account for the owning club can save a result; the form calls `PUT /api/matches/{id}/result/`. The shared [staff-role catalog](api.md#sessions-and-access) is separate and read-only.
