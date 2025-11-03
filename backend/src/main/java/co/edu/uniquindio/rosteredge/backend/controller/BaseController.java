package co.edu.uniquindio.rosteredge.backend.controller;

import co.edu.uniquindio.rosteredge.backend.exception.BusinessException;
import co.edu.uniquindio.rosteredge.backend.util.FilterUtils;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Base controller with common utility methods
 * Other controllers can extend this class to reuse functionality
 */
@Slf4j
public abstract class BaseController {

    /**
     * Builds a success response with data
     */
    protected <T> ResponseEntity<ApiResponse<T>> success(T data) {
        return ResponseEntity.ok(ApiResponse.success(data));
    }

    /**
     * Builds a success response with data and custom message
     */
    protected <T> ResponseEntity<ApiResponse<T>> success(T data, String message) {
        return ResponseEntity.ok(ApiResponse.success(data, message));
    }

    /**
     * Builds a success response for creation (HTTP 201)
     */
    protected <T> ResponseEntity<ApiResponse<T>> created(T data) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(data, "Resource created successfully"));
    }

    /**
     * Builds a success response for creation with custom message
     */
    protected <T> ResponseEntity<ApiResponse<T>> created(T data, String message) {
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(data, message));
    }

    /**
     * Builds a no content response (HTTP 204)
     */
    protected ResponseEntity<Void> noContent() {
        return ResponseEntity.noContent().build();
    }

    /**
     * Builds an error response
     */
    protected <T> ResponseEntity<ApiResponse<T>> error(String message, HttpStatus status) {
        return ResponseEntity.status(status).body(ApiResponse.error(message));
    }

    /**
     * Builds an error response with code
     */
    protected <T> ResponseEntity<ApiResponse<T>> error(String message, String code, HttpStatus status) {
        return ResponseEntity.status(status).body(ApiResponse.error(message, code));
    }

    /**
     * Handles validation errors from @Valid
     */
    protected ResponseEntity<Map<String, Object>> handleValidationErrors(BindingResult result) {
        Map<String, Object> response = new HashMap<>();
        response.put("success", false);
        response.put("message", "Validation failed");
        response.put("timestamp", System.currentTimeMillis());

        Map<String, String> errors = new HashMap<>();
        for (FieldError error : result.getFieldErrors()) {
            errors.put(error.getField(), error.getDefaultMessage());
        }
        response.put("errors", errors);

        return ResponseEntity.badRequest().body(response);
    }

    /**
     * Handles business exceptions
     */
    @ExceptionHandler(BusinessException.class)
    public ResponseEntity<ApiResponse<Void>> handleBusinessException(BusinessException ex) {
        log.warn("Business exception: {}", ex.getMessage());
        return ResponseEntity.badRequest().body(ApiResponse.error(ex.getMessage(), "BUSINESS_ERROR"));
    }

    /**
     * Handles generic exceptions
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Void>> handleGenericException(Exception ex) {
        log.error("Unexpected error", ex);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error("An unexpected error occurred"));
    }

    /**
     * Builds a paginated response
     */
    protected <T> ResponseEntity<ApiResponse<PaginatedResponse<T>>> paginatedResponse(Page<T> page) {
        PaginatedResponse<T> paginated = new PaginatedResponse<>(
                page.getContent(),
                page.getNumber(),
                page.getSize(),
                page.getTotalElements(),
                page.getTotalPages(),
                page.hasNext(),
                page.hasPrevious());
        return ResponseEntity.ok(ApiResponse.success(paginated));
    }

    /**
     * Logs controller actions
     */
    protected void logAction(String action, Object... params) {
        log.info("Controller action: {} - Parameters: {}", action, params);
    }

    /**
     * Validates if the current user has permission
     * This is a placeholder - implement based on your security setup
     */
    protected boolean hasPermission(String permission) {
        // TODO: Implement based on your authentication/authorization mechanism
        // For example, check roles or permissions from SecurityContext
        return true; // Placeholder
    }

    /**
     * Normalizes the active flag applying the default behaviour (true when null).
     */
    protected Boolean resolveActive(Boolean active) {
        return FilterUtils.resolveActive(active);
    }

    /**
     * Gets current user ID from security context
     * This is a placeholder - implement based on your security setup
     */
    protected Long getCurrentUserId() {
        // TODO: Implement based on your authentication mechanism
        // For example, extract from JWT token or SecurityContext
        return null; // Placeholder
    }

    /**
     * Inner class for API responses
     */
    public static class ApiResponse<T> {
        private boolean success;
        private String message;
        private String code;
        private T data;
        private long timestamp;

        private ApiResponse(boolean success, String message, String code, T data) {
            this.success = success;
            this.message = message;
            this.code = code;
            this.data = data;
            this.timestamp = System.currentTimeMillis();
        }

        public static <T> ApiResponse<T> success(T data) {
            return new ApiResponse<>(true, "Operation successful", null, data);
        }

        public static <T> ApiResponse<T> success(T data, String message) {
            return new ApiResponse<>(true, message, null, data);
        }

        public static <T> ApiResponse<T> error(String message) {
            return new ApiResponse<>(false, message, null, null);
        }

        public static <T> ApiResponse<T> error(String message, String code) {
            return new ApiResponse<>(false, message, code, null);
        }

        // Getters
        public boolean isSuccess() {
            return success;
        }

        public String getMessage() {
            return message;
        }

        public String getCode() {
            return code;
        }

        public T getData() {
            return data;
        }

        public long getTimestamp() {
            return timestamp;
        }
    }

    /**
     * Inner class for paginated responses
     */
    public static class PaginatedResponse<T> {
        private List<T> content;
        private int pageNumber;
        private int pageSize;
        private long totalElements;
        private int totalPages;
        private boolean hasNext;
        private boolean hasPrevious;

        public PaginatedResponse(List<T> content, int pageNumber, int pageSize,
                long totalElements, int totalPages, boolean hasNext, boolean hasPrevious) {
            this.content = content;
            this.pageNumber = pageNumber;
            this.pageSize = pageSize;
            this.totalElements = totalElements;
            this.totalPages = totalPages;
            this.hasNext = hasNext;
            this.hasPrevious = hasPrevious;
        }

        // Getters
        public List<T> getContent() {
            return content;
        }

        public int getPageNumber() {
            return pageNumber;
        }

        public int getPageSize() {
            return pageSize;
        }

        public long getTotalElements() {
            return totalElements;
        }

        public int getTotalPages() {
            return totalPages;
        }

        public boolean isHasNext() {
            return hasNext;
        }

        public boolean isHasPrevious() {
            return hasPrevious;
        }
    }
}
