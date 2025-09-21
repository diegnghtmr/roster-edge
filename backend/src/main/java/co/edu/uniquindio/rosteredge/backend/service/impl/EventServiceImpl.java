package co.edu.uniquindio.rosteredge.backend.service.impl;

import co.edu.uniquindio.rosteredge.backend.dto.EventDTO;
import co.edu.uniquindio.rosteredge.backend.exception.EntityNotFoundException;
import co.edu.uniquindio.rosteredge.backend.mapper.EntityMapper;
import co.edu.uniquindio.rosteredge.backend.model.Event;
import co.edu.uniquindio.rosteredge.backend.repository.EventRepository;
import co.edu.uniquindio.rosteredge.backend.service.EventService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

@Service
@Transactional
@Slf4j
@RequiredArgsConstructor
public class EventServiceImpl implements EventService {

    private final EventRepository eventRepository;
    private final EntityMapper entityMapper;

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
    public List<EventDTO> findAllEvents() {
        log.info("Finding all events");
        return StreamSupport.stream(eventRepository.findAll().spliterator(), false)
                .map(entityMapper::toEventDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public EventDTO findEventById(Long id) {
        log.info("Finding event with id: {}", id);
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Event not found with id: " + id));
        return entityMapper.toEventDTO(event);
    }

    @Override
    public EventDTO updateEvent(Long id, EventDTO eventDTO) {
        log.info("Updating event with id: {}", id);
        Event existingEvent = eventRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Event not found with id: " + id));

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
        if (!eventRepository.existsById(id)) {
            throw new EntityNotFoundException("Event not found with id: " + id);
        }
        eventRepository.deleteById(id);
    }
}
