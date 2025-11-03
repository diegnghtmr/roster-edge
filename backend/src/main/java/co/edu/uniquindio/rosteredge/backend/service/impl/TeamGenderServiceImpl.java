package co.edu.uniquindio.rosteredge.backend.service.impl;

import co.edu.uniquindio.rosteredge.backend.model.TeamGender;
import co.edu.uniquindio.rosteredge.backend.repository.TeamGenderRepository;
import co.edu.uniquindio.rosteredge.backend.service.TeamGenderService;
import co.edu.uniquindio.rosteredge.backend.util.FilterUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class TeamGenderServiceImpl extends SimpleCrudService<TeamGender> implements TeamGenderService {

    private final TeamGenderRepository teamGenderRepository;

    public TeamGenderServiceImpl(TeamGenderRepository repository) {
        super(repository);
        this.teamGenderRepository = repository;
    }

    @Override
    protected String getEntityName() {
        return "TeamGender";
    }

    @Override
    @Transactional(readOnly = true)
    public List<TeamGender> findByFilters(String name, Boolean active) {
        Boolean effectiveActive = FilterUtils.resolveActive(active);
        return teamGenderRepository.findByFilters(name, effectiveActive);
    }
}


