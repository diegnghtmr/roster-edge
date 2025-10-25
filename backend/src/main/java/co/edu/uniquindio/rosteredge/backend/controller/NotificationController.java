package co.edu.uniquindio.rosteredge.backend.controller;

import co.edu.uniquindio.rosteredge.backend.dto.ApiResponse;
import co.edu.uniquindio.rosteredge.backend.model.Notification;
import co.edu.uniquindio.rosteredge.backend.service.NotificationService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/notifications")
@Slf4j
public class NotificationController extends SimpleCrudController<Notification> {

    private final NotificationService notificationService;

    public NotificationController(NotificationService service) {
        super(service);
        this.notificationService = service;
    }

    @Override
    @GetMapping("/")
    public ResponseEntity<ApiResponse<List<Notification>>> findAll() {
        HttpServletRequest request = currentRequest();
        String message = trimToNull(request.getParameter("message"));
        String status = trimToNull(request.getParameter("status"));
        Boolean active = parseBoolean(request.getParameter("active"));
        LocalDateTime sendFrom = parseDateTime(request.getParameter("sendFrom"));
        LocalDateTime sendTo = parseDateTime(request.getParameter("sendTo"));

        log.info("Request to get notifications with filters - message: {}, status: {}, active: {}, sendFrom: {}, sendTo: {}",
                message, status, active, sendFrom, sendTo);

        List<Notification> notifications = notificationService.findByFilters(message, status, active, sendFrom, sendTo);
        return ResponseEntity.ok(ApiResponse.success(notifications));
    }
}

