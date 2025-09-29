package co.edu.uniquindio.rosteredge.backend.service;

import co.edu.uniquindio.rosteredge.backend.model.Streak;

import java.time.LocalDate;
import java.util.List;

public interface StreakService extends CrudService<Streak> {

    List<Streak> findByFilters(Long teamId, Boolean active,
                               LocalDate startDateFrom, LocalDate startDateTo,
                               LocalDate endDateFrom, LocalDate endDateTo);
}
