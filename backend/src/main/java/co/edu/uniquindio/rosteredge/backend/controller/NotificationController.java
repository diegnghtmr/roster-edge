package co.edu.uniquindio.rosteredge.backend.controller;

import co.edu.uniquindio.rosteredge.backend.dto.ApiResponse;
import co.edu.uniquindio.rosteredge.backend.dto.response.NotificationResponse;
import co.edu.uniquindio.rosteredge.backend.model.Notification;
import co.edu.uniquindio.rosteredge.backend.service.NotificationService;
import co.edu.uniquindio.rosteredge.backend.util.FilterUtils;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeParseException;
import java.util.List;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

@RestController
@RequestMapping("/notifications")
@Slf4j
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(NotificationService service) {
        this.notificationService = service;
    }

    @GetMapping("/")
    public ResponseEntity<ApiResponse<List<NotificationResponse>>> findAll() {
        HttpServletRequest request = currentRequest();
        String message = trimToNull(request.getParameter("message"));
        Boolean active = resolveActive(
            parseBoolean(request.getParameter("active"))
        );
        LocalDateTime sendFrom = parseDateTime(
            request.getParameter("sendFrom")
        );
        LocalDateTime sendTo = parseDateTime(request.getParameter("sendTo"));

        log.info(
            "Request to get notifications with filters - message: {}, active: {}, sendFrom: {}, sendTo: {}",
            message,
            active,
            sendFrom,
            sendTo
        );

        List<NotificationResponse> notifications =
            notificationService.findEnrichedNotifications(
                message,
                active,
                sendFrom,
                sendTo
            );
        return ResponseEntity.ok(ApiResponse.success(notifications));
    }

    @PostMapping("/")
    public ResponseEntity<ApiResponse<Notification>> create(
        @Valid @RequestBody Notification entity
    ) {
        log.info("Creating Notification");
        Notification created = notificationService.save(entity);
        return ResponseEntity.status(HttpStatus.CREATED).body(
            ApiResponse.success(created, "Notification created successfully")
        );
    }

    @GetMapping("/{id}/")
    public ResponseEntity<ApiResponse<Notification>> findById(
        @PathVariable Long id
    ) {
        Notification item = notificationService.findByIdOrThrow(id);
        return ResponseEntity.ok(ApiResponse.success(item));
    }

    @PutMapping("/{id}/")
    public ResponseEntity<ApiResponse<Notification>> update(
        @PathVariable Long id,
        @Valid @RequestBody Notification entity
    ) {
        Notification updated = notificationService.update(id, entity);
        return ResponseEntity.ok(
            ApiResponse.success(updated, "Notification updated successfully")
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        notificationService.deleteById(id);
        return ResponseEntity.ok(
            ApiResponse.<Void>success(null, "Notification deleted successfully")
        );
    }

    /**
     * Provides access to the current HTTP request.
     */
    protected HttpServletRequest currentRequest() {
        ServletRequestAttributes attributes =
            (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        if (attributes == null) {
            throw new IllegalStateException("No current request found");
        }
        return attributes.getRequest();
    }

    /**
     * Parses a string into a Long, returning null for invalid values.
     */
    protected Long parseLong(String value) {
        try {
            return value != null ? Long.parseLong(value) : null;
        } catch (NumberFormatException ex) {
            return null;
        }
    }

    /**
     * Parses a string into an Integer, returning null for invalid values.
     */
    protected Integer parseInteger(String value) {
        try {
            return value != null ? Integer.parseInt(value) : null;
        } catch (NumberFormatException ex) {
            return null;
        }
    }

    /**
     * Parses a string into a BigDecimal, returning null for invalid values.
     */
    protected BigDecimal parseBigDecimal(String value) {
        try {
            return value != null ? new BigDecimal(value) : null;
        } catch (NumberFormatException ex) {
            return null;
        }
    }

    /**
     * Parses a string into a LocalDate, returning null for invalid values.
     */
    protected LocalDate parseDate(String value) {
        try {
            return value != null ? LocalDate.parse(value) : null;
        } catch (DateTimeParseException ex) {
            return null;
        }
    }

    /**
     * Parses a string into a LocalDateTime, returning null for invalid values.
     */
    protected LocalDateTime parseDateTime(String value) {
        try {
            return value != null ? LocalDateTime.parse(value) : null;
        } catch (DateTimeParseException ex) {
            return null;
        }
    }

    /**
     * Parses a string into a Boolean, supporting several truthy/falsy representations.
     */
    protected Boolean parseBoolean(String value) {
        if (value == null) {
            return null;
        }
        return switch (value.toLowerCase()) {
            case "true", "1", "yes", "y" -> Boolean.TRUE;
            case "false", "0", "no", "n" -> Boolean.FALSE;
            default -> null;
        };
    }

    /**
     * Trims a string and converts empty values to null.
     */
    protected String trimToNull(String value) {
        if (value == null) {
            return null;
        }
        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }

    /**
     * Normalizes the active flag applying the default behaviour.
     */
    protected Boolean resolveActive(Boolean active) {
        return FilterUtils.resolveActive(active);
    }
}
