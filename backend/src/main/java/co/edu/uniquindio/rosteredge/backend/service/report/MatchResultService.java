package co.edu.uniquindio.rosteredge.backend.service.report;

import co.edu.uniquindio.rosteredge.backend.dto.request.MatchResultRequest;
import co.edu.uniquindio.rosteredge.backend.exception.BusinessException;
import co.edu.uniquindio.rosteredge.backend.exception.EntityNotFoundException;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class MatchResultService {

    private final JdbcTemplate jdbc;

    @Transactional
    public void recordResult(long matchId, MatchResultRequest scores) {
        // Match schedule updates acquire the same row lock before replacing either assignment.
        if (jdbc.queryForList("SELECT id FROM \"Match\" WHERE id = ? AND active IS TRUE FOR UPDATE",
                Long.class, matchId).isEmpty()) {
            throw new EntityNotFoundException("Match", matchId);
        }
        List<Long> home = activeTeamIds("MatchHomeTeam", matchId);
        List<Long> away = activeTeamIds("MatchAwayTeam", matchId);
        if (home.size() != 1 || away.size() != 1 || home.getFirst().equals(away.getFirst())) {
            throw new BusinessException("A result requires exactly one distinct home and away team");
        }
        jdbc.update("""
                INSERT INTO "MatchResult" (match_id, home_team_id, away_team_id, home_score, away_score)
                VALUES (?, ?, ?, ?, ?)
                ON CONFLICT (match_id) DO UPDATE SET
                    home_team_id = EXCLUDED.home_team_id, away_team_id = EXCLUDED.away_team_id,
                    home_score = EXCLUDED.home_score, away_score = EXCLUDED.away_score
                """, matchId, home.getFirst(), away.getFirst(), scores.homeScore(), scores.awayScore());
    }

    private List<Long> activeTeamIds(String table, long matchId) {
        return jdbc.queryForList("""
                SELECT team_id FROM "%s" WHERE match_id = ? AND active IS TRUE ORDER BY team_id FOR UPDATE
                """.formatted(table), Long.class, matchId);
    }
}
