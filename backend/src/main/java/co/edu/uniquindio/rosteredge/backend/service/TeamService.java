package co.edu.uniquindio.rosteredge.backend.service;

import co.edu.uniquindio.rosteredge.backend.dto.TeamDTO;
import java.util.List;

public interface TeamService {
    TeamDTO createTeam(TeamDTO teamDTO);
    List<TeamDTO> findAllTeams();
    TeamDTO findTeamById(Long id);
    TeamDTO updateTeam(Long id, TeamDTO teamDTO);
    void deleteTeam(Long id);
}
