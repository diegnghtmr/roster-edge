package co.edu.uniquindio.rosteredge.backend.service;

import co.edu.uniquindio.rosteredge.backend.model.MatchHomeTeam;

import java.util.List;

public interface MatchHomeTeamService extends CrudService<MatchHomeTeam> {

    List<MatchHomeTeam> findByFilters(Long matchId, Long teamId, Boolean active);
}
