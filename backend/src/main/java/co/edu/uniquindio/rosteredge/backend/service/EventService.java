package co.edu.uniquindio.rosteredge.backend.service;

import co.edu.uniquindio.rosteredge.backend.dto.EventDTO;
import java.util.List;

public interface EventService {
    EventDTO createEvent(EventDTO eventDTO);
    List<EventDTO> findAllEvents();
    EventDTO findEventById(Long id);
    EventDTO updateEvent(Long id, EventDTO eventDTO);
    void deleteEvent(Long id);
}
