package co.edu.uniquindio.rosteredge.backend.service;

import co.edu.uniquindio.rosteredge.backend.dto.TeamDTO;
import co.edu.uniquindio.rosteredge.backend.dto.filter.TeamInsightsFilter;
import co.edu.uniquindio.rosteredge.backend.dto.response.TeamInsightsResponse;
import java.util.List;

public interface TeamService {
    TeamDTO createTeam(TeamDTO teamDTO);
    List<TeamDTO> findAllTeams(Long clubId, Long genderId, Long categoryId, Boolean active, String name, String mascot);
    TeamDTO findTeamById(Long id);
    TeamDTO updateTeam(Long id, TeamDTO teamDTO);
    void deleteTeam(Long id);
    void deleteTeamHard(Long id);

    List<TeamInsightsResponse> findTeamInsights(TeamInsightsFilter filter);
}
