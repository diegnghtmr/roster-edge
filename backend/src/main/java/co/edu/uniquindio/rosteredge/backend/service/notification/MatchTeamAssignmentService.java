package co.edu.uniquindio.rosteredge.backend.service.notification;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@RequiredArgsConstructor
@Slf4j
public class MatchTeamAssignmentService {

    private final JdbcTemplate jdbcTemplate;

    @Transactional
    public void assignHomeTeam(Long matchId, Long teamId) {
        if (matchId == null || teamId == null) {
            return;
        }
        jdbcTemplate.update("DELETE FROM \"MatchHomeTeam\" WHERE match_id = ?", matchId);
        jdbcTemplate.update(
                "INSERT INTO \"MatchHomeTeam\" (match_id, team_id, score) VALUES (?, ?, 0)",
                matchId,
                teamId);
        log.debug("Assigned home team {} to match {}", teamId, matchId);
    }

    @Transactional
    public void assignAwayTeam(Long matchId, Long teamId) {
        if (matchId == null || teamId == null) {
            return;
        }
        jdbcTemplate.update("DELETE FROM \"MatchAwayTeam\" WHERE match_id = ?", matchId);
        jdbcTemplate.update(
                "INSERT INTO \"MatchAwayTeam\" (match_id, team_id, score) VALUES (?, ?, 0)",
                matchId,
                teamId);
        log.debug("Assigned away team {} to match {}", teamId, matchId);
    }
}
