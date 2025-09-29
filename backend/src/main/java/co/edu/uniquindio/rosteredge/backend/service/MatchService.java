package co.edu.uniquindio.rosteredge.backend.service;

import co.edu.uniquindio.rosteredge.backend.model.Match;
import java.time.LocalDate;
import java.util.List;

public interface MatchService extends CrudService<Match> {
    List<Match> findAllMatches(Long teamId, Long seasonId, Long matchdayId, Long stadiumId,
                               Boolean active, LocalDate dateFrom, LocalDate dateTo);
    List<Match> findByTeamId(Long teamId);
    List<Match> findByDateBetween(LocalDate startDate, LocalDate endDate);
    List<Match> findActiveMatches();
}

