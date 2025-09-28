package co.edu.uniquindio.rosteredge.backend.service.impl;

import co.edu.uniquindio.rosteredge.backend.model.TeamCategory;
import co.edu.uniquindio.rosteredge.backend.repository.TeamCategoryRepository;
import co.edu.uniquindio.rosteredge.backend.service.TeamCategoryService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class TeamCategoryServiceImpl extends SimpleCrudService<TeamCategory> implements TeamCategoryService {

    public TeamCategoryServiceImpl(TeamCategoryRepository repository) {
        super(repository);
    }

    @Override
    protected String getEntityName() {
        return "TeamCategory";
    }
}


