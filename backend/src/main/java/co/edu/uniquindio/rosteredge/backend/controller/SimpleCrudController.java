package co.edu.uniquindio.rosteredge.backend.controller;

import co.edu.uniquindio.rosteredge.backend.dto.ApiResponse;
import co.edu.uniquindio.rosteredge.backend.model.BaseEntity;
import co.edu.uniquindio.rosteredge.backend.service.CrudService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeParseException;
import java.util.List;

/**
 * Shared CRUD controller exposing standard endpoints that return ApiResponse payloads.
 */
@Slf4j
public abstract class SimpleCrudController<T extends BaseEntity> {

    private final CrudService<T> service;

    protected SimpleCrudController(CrudService<T> service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<T>> create(@Valid @RequestBody T entity) {
        log.info("Creating {}", entity.getClass().getSimpleName());
        T created = service.save(entity);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(created, "Resource created successfully"));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<T>>> findAll() {
        List<T> items = service.findAll();
        return ResponseEntity.ok(ApiResponse.success(items));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<T>> findById(@PathVariable Long id) {
        T item = service.findByIdOrThrow(id);
        return ResponseEntity.ok(ApiResponse.success(item));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<T>> update(@PathVariable Long id, @Valid @RequestBody T entity) {
        T updated = service.update(id, entity);
        return ResponseEntity.ok(ApiResponse.success(updated, "Resource updated successfully"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        service.deleteById(id);
        return ResponseEntity.ok(ApiResponse.<Void>success(null, "Resource deleted successfully"));
    }

    /**
     * Provides access to the current HTTP request.
     */
    protected HttpServletRequest currentRequest() {
        ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
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
}
