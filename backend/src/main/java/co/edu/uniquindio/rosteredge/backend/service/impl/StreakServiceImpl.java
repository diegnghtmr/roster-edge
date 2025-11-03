package co.edu.uniquindio.rosteredge.backend.service.impl;

import co.edu.uniquindio.rosteredge.backend.model.Streak;
import co.edu.uniquindio.rosteredge.backend.repository.StreakRepository;
import co.edu.uniquindio.rosteredge.backend.service.StreakService;
import co.edu.uniquindio.rosteredge.backend.util.FilterUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@Transactional
public class StreakServiceImpl extends SimpleCrudService<Streak> implements StreakService {

    private final StreakRepository streakRepository;

    public StreakServiceImpl(StreakRepository repository) {
        super(repository);
        this.streakRepository = repository;
    }

    @Override
    protected String getEntityName() {
        return "Streak";
    }

    @Override
    @Transactional(readOnly = true)
    public List<Streak> findByFilters(Long teamId, Boolean active,
                                      LocalDate startDateFrom, LocalDate startDateTo,
                                      LocalDate endDateFrom, LocalDate endDateTo) {
        Boolean effectiveActive = FilterUtils.resolveActive(active);
        return streakRepository.findByFilters(teamId, effectiveActive, startDateFrom, startDateTo, endDateFrom, endDateTo);
    }
}


