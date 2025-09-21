package co.edu.uniquindio.rosteredge.backend.controller;

import co.edu.uniquindio.rosteredge.backend.dto.ApiResponse;
import co.edu.uniquindio.rosteredge.backend.dto.EventDTO;
import co.edu.uniquindio.rosteredge.backend.service.EventService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/events")
@RequiredArgsConstructor
@Slf4j
public class EventController extends BaseController {

    private final EventService eventService;

    @PostMapping
    public ResponseEntity<ApiResponse<EventDTO>> createEvent(@Valid @RequestBody EventDTO eventDTO) {
        log.info("Request to create event: {}", eventDTO.getName());
        EventDTO createdEvent = eventService.createEvent(eventDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(createdEvent, "Event created successfully"));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<EventDTO>>> getAllEvents() {
        log.info("Request to get all events");
        List<EventDTO> events = eventService.findAllEvents();
        return ResponseEntity.ok(ApiResponse.success(events));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<EventDTO>> getEventById(@PathVariable Long id) {
        log.info("Request to get event by id: {}", id);
        EventDTO event = eventService.findEventById(id);
        return ResponseEntity.ok(ApiResponse.success(event));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<EventDTO>> updateEvent(@PathVariable Long id, @Valid @RequestBody EventDTO eventDTO) {
        log.info("Request to update event with id: {}", id);
        EventDTO updatedEvent = eventService.updateEvent(id, eventDTO);
        return ResponseEntity.ok(ApiResponse.success(updatedEvent, "Event updated successfully"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteEvent(@PathVariable Long id) {
        log.info("Request to delete event with id: {}", id);
        eventService.deleteEvent(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Event deleted successfully"));
    }
}
