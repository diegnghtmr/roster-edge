package co.edu.uniquindio.rosteredge.backend.service.impl;

import co.edu.uniquindio.rosteredge.backend.dto.TeamDTO;
import co.edu.uniquindio.rosteredge.backend.dto.filter.TeamInsightsFilter;
import co.edu.uniquindio.rosteredge.backend.dto.response.TeamInsightsResponse;
import co.edu.uniquindio.rosteredge.backend.exception.EntityNotFoundException;
import co.edu.uniquindio.rosteredge.backend.mapper.EntityMapper;
import co.edu.uniquindio.rosteredge.backend.model.Team;
import co.edu.uniquindio.rosteredge.backend.repository.TeamRepository;
import co.edu.uniquindio.rosteredge.backend.repository.view.TeamInsightsQueryRepository;
import co.edu.uniquindio.rosteredge.backend.service.TeamService;
import co.edu.uniquindio.rosteredge.backend.service.cascade.CascadeDeleteManager;
import co.edu.uniquindio.rosteredge.backend.util.FilterUtils;
import java.util.List;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
@Slf4j
@RequiredArgsConstructor
public class TeamServiceImpl implements TeamService {

    private final TeamRepository teamRepository;
    private final EntityMapper entityMapper;
    private final CascadeDeleteManager cascadeDeleteManager;
    private final TeamInsightsQueryRepository teamInsightsQueryRepository;

    @Override
    public TeamDTO createTeam(TeamDTO teamDTO) {
        log.info("Creating team: {}", teamDTO.getName());
        Team team = entityMapper.toTeamEntity(teamDTO);
        team.prePersist();
        Team savedTeam = teamRepository.save(team);
        return entityMapper.toTeamDTO(savedTeam);
    }

    @Override
    @Transactional(readOnly = true)
    public List<TeamDTO> findAllTeams(Long clubId, Long genderId, Long categoryId, Boolean active) {
        Boolean effectiveActive = FilterUtils.resolveActive(active);
        log.info("Finding teams with filters - clubId: {}, genderId: {}, categoryId: {}, active: {}", clubId, genderId, categoryId, effectiveActive);
        return teamRepository.findByFilters(clubId, genderId, categoryId, effectiveActive)
                .stream()
                .map(entityMapper::toTeamDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<TeamInsightsResponse> findTeamInsights(TeamInsightsFilter filter) {
        TeamInsightsFilter effectiveFilter = filter != null ? filter : new TeamInsightsFilter();
        if (effectiveFilter.getActive() == null) {
            effectiveFilter.setActive(Boolean.TRUE);
        }
        log.info("Finding team insights with filter: {}", effectiveFilter);
        return teamInsightsQueryRepository.findTeams(effectiveFilter);
    }

    @Override
    @Transactional(readOnly = true)
    public TeamDTO findTeamById(Long id) {
        log.info("Finding team with id: {}", id);
        Team team = teamRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Team not found with id: " + id));

        if (!Boolean.TRUE.equals(team.getActive())) {
            throw new EntityNotFoundException("Team not found with id: " + id);
        }
        return entityMapper.toTeamDTO(team);
    }

    @Override
    public TeamDTO updateTeam(Long id, TeamDTO teamDTO) {
        log.info("Updating team with id: {}", id);
        Team existingTeam = teamRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Team not found with id: " + id));

        if (!Boolean.TRUE.equals(existingTeam.getActive())) {
            throw new EntityNotFoundException("Team not found with id: " + id);
        }

        existingTeam.setName(teamDTO.getName());
        existingTeam.setGenderId(teamDTO.getGenderId());
        existingTeam.setCategoryId(teamDTO.getCategoryId());
        existingTeam.setMascot(teamDTO.getMascot());
        existingTeam.setFoundation(teamDTO.getFoundation());
        existingTeam.setClubId(teamDTO.getClubId());
        existingTeam.preUpdate();

        Team updatedTeam = teamRepository.save(existingTeam);
        return entityMapper.toTeamDTO(updatedTeam);
    }

    @Override
    public void deleteTeam(Long id) {
        log.info("Deleting team with id: {}", id);
        Team team = teamRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Team not found with id: " + id));

        if (!Boolean.TRUE.equals(team.getActive())) {
            log.debug("Team with id {} is already inactive", id);
            return;
        }

        team.softDelete();
        team.preUpdate();
        teamRepository.save(team);
    }

    @Override
    public void deleteTeamHard(Long id) {
        log.info("Hard deleting team with id: {}", id);
        if (!teamRepository.existsById(id)) {
            throw new EntityNotFoundException("Team not found with id: " + id);
        }
        cascadeDeleteManager.clearAssociations("Team", id);
        teamRepository.deleteById(id);
    }
}
