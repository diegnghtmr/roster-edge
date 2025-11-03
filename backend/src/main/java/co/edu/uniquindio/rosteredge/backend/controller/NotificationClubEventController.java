package co.edu.uniquindio.rosteredge.backend.controller;

import co.edu.uniquindio.rosteredge.backend.dto.ApiResponse;
import co.edu.uniquindio.rosteredge.backend.model.NotificationClubEvent;
import co.edu.uniquindio.rosteredge.backend.service.NotificationClubEventService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/notification-club-events")
@Slf4j
public class NotificationClubEventController extends SimpleCrudController<NotificationClubEvent> {

    private final NotificationClubEventService notificationClubEventService;

    public NotificationClubEventController(NotificationClubEventService service) {
        super(service);
        this.notificationClubEventService = service;
    }

    @Override
    @GetMapping("/")
    public ResponseEntity<ApiResponse<List<NotificationClubEvent>>> findAll() {
        HttpServletRequest request = currentRequest();
        
        Long notificationId = parseLong(request.getParameter("notificationId"));
        Long clubEventId = parseLong(request.getParameter("clubEventId"));
        Boolean active = resolveActive(parseBoolean(request.getParameter("active")));

        log.info("Request to get notification club events with filters - notificationId: {}, clubEventId: {}, active: {}",
                notificationId, clubEventId, active);

        List<NotificationClubEvent> events = notificationClubEventService.findByFilters(notificationId, clubEventId, active);
        return ResponseEntity.ok(ApiResponse.success(events));
    }
}

