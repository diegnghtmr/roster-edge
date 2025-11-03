package co.edu.uniquindio.rosteredge.backend.service.impl;

import co.edu.uniquindio.rosteredge.backend.model.Matchday;
import co.edu.uniquindio.rosteredge.backend.repository.MatchdayRepository;
import co.edu.uniquindio.rosteredge.backend.service.MatchdayService;
import co.edu.uniquindio.rosteredge.backend.util.FilterUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class MatchdayServiceImpl extends SimpleCrudService<Matchday> implements MatchdayService {

    private final MatchdayRepository matchdayRepository;

    public MatchdayServiceImpl(MatchdayRepository repository) {
        super(repository);
        this.matchdayRepository = repository;
    }

    @Override
    protected String getEntityName() {
        return "Matchday";
    }

    @Override
    @Transactional(readOnly = true)
    public List<Matchday> findByFilters(String name, Boolean active) {
        Boolean effectiveActive = FilterUtils.resolveActive(active);
        return matchdayRepository.findByFilters(name, effectiveActive);
    }
}


