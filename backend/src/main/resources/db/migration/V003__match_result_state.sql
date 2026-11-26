-- The presence of a result is explicit; no legacy scores or dates are used to backfill it.
CREATE TABLE "MatchResult" (
    match_id bigint PRIMARY KEY REFERENCES "Match" (id) ON DELETE CASCADE,
    home_team_id bigint NOT NULL,
    away_team_id bigint NOT NULL,
    home_score integer NOT NULL CHECK (home_score >= 0),
    away_score integer NOT NULL CHECK (away_score >= 0),
    CHECK (home_team_id <> away_team_id),
    FOREIGN KEY (match_id, home_team_id) REFERENCES "MatchHomeTeam" (match_id, team_id) ON DELETE CASCADE,
    FOREIGN KEY (match_id, away_team_id) REFERENCES "MatchAwayTeam" (match_id, team_id) ON DELETE CASCADE
);

CREATE VIEW "FinalMatchResult" AS
SELECT r.match_id, r.home_team_id, r.away_team_id, r.home_score, r.away_score
FROM "MatchResult" r
JOIN "Match" m ON m.id = r.match_id AND m.active IS TRUE
JOIN "MatchHomeTeam" h ON h.match_id = r.match_id AND h.team_id = r.home_team_id AND h.active IS TRUE
JOIN "MatchAwayTeam" a ON a.match_id = r.match_id AND a.team_id = r.away_team_id AND a.active IS TRUE;
