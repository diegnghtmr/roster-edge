package co.edu.uniquindio.rosteredge.backend.service.impl;

import co.edu.uniquindio.rosteredge.backend.model.TeamCategory;
import co.edu.uniquindio.rosteredge.backend.repository.TeamCategoryRepository;
import co.edu.uniquindio.rosteredge.backend.service.TeamCategoryService;
import co.edu.uniquindio.rosteredge.backend.util.FilterUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class TeamCategoryServiceImpl extends SimpleCrudService<TeamCategory> implements TeamCategoryService {

    private final TeamCategoryRepository teamCategoryRepository;

    public TeamCategoryServiceImpl(TeamCategoryRepository repository) {
        super(repository);
        this.teamCategoryRepository = repository;
    }

    @Override
    protected String getEntityName() {
        return "TeamCategory";
    }

    @Override
    @Transactional(readOnly = true)
    public List<TeamCategory> findByFilters(String name, Boolean active) {
        Boolean effectiveActive = FilterUtils.resolveActive(active);
        return teamCategoryRepository.findByFilters(name, effectiveActive);
    }
}


