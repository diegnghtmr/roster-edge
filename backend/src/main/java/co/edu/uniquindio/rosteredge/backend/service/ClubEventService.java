package co.edu.uniquindio.rosteredge.backend.service;

import co.edu.uniquindio.rosteredge.backend.model.ClubEvent;

import java.util.List;

public interface ClubEventService extends CrudService<ClubEvent> {

    List<ClubEvent> findByFilters(Long clubId, Long eventId, Boolean active);
}
