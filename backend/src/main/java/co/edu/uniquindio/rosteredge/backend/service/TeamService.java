package co.edu.uniquindio.rosteredge.backend.service;

import co.edu.uniquindio.rosteredge.backend.model.Team;
import java.util.List;
import java.util.Optional;

public interface TeamService extends BaseService<Team, Long> {
    Optional<Team> findByName(String name);
    List<Team> findActiveTeams();
    boolean existsByName(String name);
}
