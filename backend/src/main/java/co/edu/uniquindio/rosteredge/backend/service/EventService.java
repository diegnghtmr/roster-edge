package co.edu.uniquindio.rosteredge.backend.service;

import co.edu.uniquindio.rosteredge.backend.dto.EventDTO;

import java.time.LocalDate;
import java.util.List;

public interface EventService {
    EventDTO createEvent(EventDTO eventDTO);
    List<EventDTO> findAllEvents(Long seasonId, String name, String description, Long venueId, Boolean active, LocalDate dateFrom, LocalDate dateTo);
    EventDTO findEventById(Long id);
    EventDTO updateEvent(Long id, EventDTO eventDTO);
    void deleteEvent(Long id);
    void deleteEventHard(Long id);
}
