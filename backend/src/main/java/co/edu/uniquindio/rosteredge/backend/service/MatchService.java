package co.edu.uniquindio.rosteredge.backend.service;

import co.edu.uniquindio.rosteredge.backend.model.Match;
import java.time.LocalDateTime;
import java.util.List;

public interface MatchService extends BaseService<Match, Long> {
    List<Match> findByTeamId(Long teamId);
    List<Match> findByStatus(String status);
    List<Match> findByMatchDateBetween(LocalDateTime startDate, LocalDateTime endDate);
    List<Match> findActiveMatches();
}
