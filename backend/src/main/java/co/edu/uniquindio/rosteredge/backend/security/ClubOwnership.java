package co.edu.uniquindio.rosteredge.backend.security;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import java.util.HashSet;
import java.util.Set;

/** Tenant ownership is computed from persisted relations, never from the caller's filters. */
@Component
final class ClubOwnership {

    private final JdbcTemplate jdbc;

    ClubOwnership(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    private static final String CLUB = "x.club_id = scope.club_id";
    private static final String TEAM = "t.club_id = scope.club_id";

    private static final String MATCH_FROM = "\"Match\" x JOIN \"Event\" e ON e.id=x.event_id JOIN \"Season\" s ON s.id=e.season_id";
    private static final String MEMBER_FROM = "o JOIN \"Team\" t ON t.id=o.team_id";

    private record Scope(String from, String predicate) {
        String sql() {
            return "SELECT x.id FROM " + from + " CROSS JOIN (SELECT ?::bigint AS club_id) scope WHERE " + predicate;
        }
    }

    private Scope scope(String resource) {
        return switch (resource) {
            case "clubs" -> new Scope("\"Club\" x", "x.id = scope.club_id");
            case "teams" -> direct("Team");
            case "rosters" -> direct("Roster");
            case "seasons" -> direct("Season");
            case "venues" -> direct("Venue");
            case "club-events" -> direct("ClubEvent");
            case "events" -> new Scope("\"Event\" x JOIN \"Season\" s ON s.id=x.season_id", "s.club_id = scope.club_id");
            case "matches" -> new Scope(MATCH_FROM, "s.club_id = scope.club_id");
            case "stadiums" -> new Scope("\"Stadium\" x JOIN \"Venue\" v ON v.id=x.venue_id", "v.club_id = scope.club_id");
            case "staff" -> byTeam("Staff");
            case "players" -> byTeam("Player");
            case "streaks" -> byTeam("Streak");
            case "users" -> new Scope("\"User\" x", """
                    (SELECT COUNT(*) FROM "User" duplicate WHERE duplicate.id=x.id) = 1
                    AND (EXISTS (SELECT 1 FROM "Staff" %s WHERE o.id=x.id AND %s)
                         OR EXISTS (SELECT 1 FROM "Player" %s WHERE o.id=x.id AND %s))
                    """.formatted(MEMBER_FROM, TEAM, MEMBER_FROM, TEAM));
            case "payments" -> new Scope("\"Payment\" x JOIN \"Roster\" r ON r.id=x.roster_id", "r.club_id = scope.club_id");
            case "subscriptions" -> new Scope("\"Subscription\" x JOIN \"Roster\" r ON r.subscription_id=x.id",
                    "r.club_id = scope.club_id");
            case "notifications" -> new Scope("\"Notification\" x", """
                    EXISTS (SELECT 1 FROM "NotificationClubEvent" n JOIN "ClubEvent" ce ON ce.id=n.club_event_id
                            WHERE n.notification_id=x.id AND n.active AND ce.active AND ce.club_id=scope.club_id)
                    """);
            default -> throw new ClubScopeDeniedException();
        };
    }

    private static Scope direct(String table) {
        return new Scope("\"" + table + "\" x", CLUB);
    }

    private static Scope byTeam(String table) {
        return new Scope("\"" + table + "\" x JOIN \"Team\" t ON t.id=x.team_id", TEAM);
    }

    void require(String resource, long id, RosterPrincipal principal) {
        if (!Boolean.TRUE.equals(jdbc.queryForObject("SELECT EXISTS (SELECT 1 FROM (" + scope(resource).sql()
                + ") owned WHERE owned.id = ?)", Boolean.class, principal.clubId(), id))) {
            throw new ClubScopeDeniedException();
        }
    }

    Set<Long> allowedIds(String resource, RosterPrincipal principal) {
        return new HashSet<>(jdbc.queryForList(scope(resource).sql(), Long.class, principal.clubId()));
    }
}
