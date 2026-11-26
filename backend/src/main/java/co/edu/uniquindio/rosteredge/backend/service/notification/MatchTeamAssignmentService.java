package co.edu.uniquindio.rosteredge.backend.service.notification;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

@Component
@RequiredArgsConstructor
@Slf4j
@Transactional(propagation = Propagation.MANDATORY)
public class MatchTeamAssignmentService {

    private final JdbcTemplate jdbcTemplate;

    public void assignHomeTeam(Long matchId, Long teamId) {
        assignTeam("MatchHomeTeam", matchId, teamId);
    }

    public void assignAwayTeam(Long matchId, Long teamId) {
        assignTeam("MatchAwayTeam", matchId, teamId);
    }

    private void assignTeam(String table, Long matchId, Long teamId) {
        jdbcTemplate.update("DELETE FROM \"%s\" WHERE match_id = ? AND team_id <> ?".formatted(table),
                matchId, teamId);
        // Keep the existing assignment (and any recorded result) when the participant did not change.
        jdbcTemplate.update("""
                INSERT INTO "%1$s" (match_id, team_id, score) VALUES (?, ?, 0)
                ON CONFLICT (match_id, team_id) DO UPDATE SET active = true, updated_at = now()
                WHERE "%1$s".active IS DISTINCT FROM true
                """.formatted(table), matchId, teamId);
        log.debug("Assigned team {} to match {} in {}", teamId, matchId, table);
    }
}
