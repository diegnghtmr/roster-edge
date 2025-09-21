package co.edu.uniquindio.rosteredge.backend.service;

import co.edu.uniquindio.rosteredge.backend.model.Match;
import java.time.LocalDate;
import java.util.List;

public interface MatchService extends BaseService<Match, Long> {
    List<Match> findByTeamId(Long teamId);
    List<Match> findByDateBetween(LocalDate startDate, LocalDate endDate);
    List<Match> findActiveMatches();
}
