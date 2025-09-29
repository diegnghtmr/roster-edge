package co.edu.uniquindio.rosteredge.backend.service;

import co.edu.uniquindio.rosteredge.backend.model.Venue;

import java.time.LocalDate;
import java.util.List;

public interface VenueService extends CrudService<Venue> {

    List<Venue> findByFilters(Long clubId, Long cityId, Boolean active,
                              String name, String email,
                              LocalDate foundationFrom, LocalDate foundationTo);
}
