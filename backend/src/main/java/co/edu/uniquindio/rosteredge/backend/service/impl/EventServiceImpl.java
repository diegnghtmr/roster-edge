package co.edu.uniquindio.rosteredge.backend.service.impl;

import co.edu.uniquindio.rosteredge.backend.dto.EventDTO;
import co.edu.uniquindio.rosteredge.backend.exception.EntityNotFoundException;
import co.edu.uniquindio.rosteredge.backend.mapper.EntityMapper;
import co.edu.uniquindio.rosteredge.backend.model.Event;
import co.edu.uniquindio.rosteredge.backend.repository.EventRepository;
import co.edu.uniquindio.rosteredge.backend.service.EventService;
import co.edu.uniquindio.rosteredge.backend.service.cascade.CascadeDeleteManager;
import co.edu.uniquindio.rosteredge.backend.util.FilterUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
@Slf4j
@RequiredArgsConstructor
public class EventServiceImpl implements EventService {

    private final EventRepository eventRepository;
    private final EntityMapper entityMapper;
    private final CascadeDeleteManager cascadeDeleteManager;

    @Override
    public EventDTO createEvent(EventDTO eventDTO) {
        log.info("Creating event: {}", eventDTO.getName());
        Event event = entityMapper.toEventEntity(eventDTO);
        event.prePersist();
        Event savedEvent = eventRepository.save(event);
        return entityMapper.toEventDTO(savedEvent);
    }

    @Override
    @Transactional(readOnly = true)
    public List<EventDTO> findAllEvents(Long seasonId, String name, String description, Long venueId, Boolean active, LocalDate dateFrom, LocalDate dateTo) {
        Boolean effectiveActive = FilterUtils.resolveActive(active);
        log.info("Finding events with filters - seasonId: {}, name: {}, description: {}, venueId: {}, active: {}, dateFrom: {}, dateTo: {}",
                seasonId, name, description, venueId, effectiveActive, dateFrom, dateTo);
        return eventRepository.findByFilters(seasonId, name, description, venueId, effectiveActive, dateFrom, dateTo)
                .stream()
                .map(entityMapper::toEventDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public EventDTO findEventById(Long id) {
        log.info("Finding event with id: {}", id);
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Event not found with id: " + id));

        if (!Boolean.TRUE.equals(event.getActive())) {
            throw new EntityNotFoundException("Event not found with id: " + id);
        }

        return entityMapper.toEventDTO(event);
    }

    @Override
    public EventDTO updateEvent(Long id, EventDTO eventDTO) {
        log.info("Updating event with id: {}", id);
        Event existingEvent = eventRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Event not found with id: " + id));

        if (!Boolean.TRUE.equals(existingEvent.getActive())) {
            throw new EntityNotFoundException("Event not found with id: " + id);
        }

        existingEvent.setSeasonId(eventDTO.getSeasonId());
        existingEvent.setVenueId(eventDTO.getVenueId());
        existingEvent.setName(eventDTO.getName());
        existingEvent.setDescription(eventDTO.getDescription());
        existingEvent.setDate(eventDTO.getDate());
        existingEvent.preUpdate();

        Event updatedEvent = eventRepository.save(existingEvent);
        return entityMapper.toEventDTO(updatedEvent);
    }

    @Override
    public void deleteEvent(Long id) {
        log.info("Deleting event with id: {}", id);
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Event not found with id: " + id));

        if (!Boolean.TRUE.equals(event.getActive())) {
            log.debug("Event with id {} is already inactive", id);
            return;
        }

        event.softDelete();
        event.preUpdate();
        eventRepository.save(event);
    }

    @Override
    public void deleteEventHard(Long id) {
        log.info("Hard deleting event with id: {}", id);
        if (!eventRepository.existsById(id)) {
            throw new EntityNotFoundException("Event not found with id: " + id);
        }
        cascadeDeleteManager.clearAssociations("Event", id);
        eventRepository.deleteById(id);
    }
}

