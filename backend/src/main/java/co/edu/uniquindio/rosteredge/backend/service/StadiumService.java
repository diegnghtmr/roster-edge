package co.edu.uniquindio.rosteredge.backend.service;

import co.edu.uniquindio.rosteredge.backend.model.Stadium;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public interface StadiumService extends CrudService<Stadium> {

    List<Stadium> findByFilters(Long venueId, String surface, Boolean active,
                                Integer capacityFrom, Integer capacityTo,
                                LocalDate foundationFrom, LocalDate foundationTo,
                                BigDecimal areaFrom, BigDecimal areaTo);
}
