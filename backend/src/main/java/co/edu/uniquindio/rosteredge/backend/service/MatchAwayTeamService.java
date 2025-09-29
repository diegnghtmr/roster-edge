package co.edu.uniquindio.rosteredge.backend.service;

import co.edu.uniquindio.rosteredge.backend.model.MatchAwayTeam;

import java.util.List;

public interface MatchAwayTeamService extends CrudService<MatchAwayTeam> {

    List<MatchAwayTeam> findByFilters(Long matchId, Long teamId, Boolean active);
}
