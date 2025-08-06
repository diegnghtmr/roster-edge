package co.edu.uniquindio.rosteredge.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Standard DTO for API responses
 * Provides a consistent structure for all responses
 * 
 * @param <T> The type of data contained in the response
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ApiResponse<T> {
    
    /**
     * Indicates if the operation was successful
     */
    private boolean success;
    
    /**
     * Descriptive message about the result
     */
    private String message;
    
    /**
     * The response data (can be null in case of error)
     */
    private T data;
    
    /**
     * Error code (only in case of error)
     */
    private String errorCode;
    
    /**
     * Response timestamp
     */
    @Builder.Default
    private long timestamp = System.currentTimeMillis();
    
    /**
     * Static method to create a successful response
     */
    public static <T> ApiResponse<T> success(T data) {
        return ApiResponse.<T>builder()
                .success(true)
                .data(data)
                .build();
    }
    
    /**
     * Static method to create a successful response with message
     */
    public static <T> ApiResponse<T> success(T data, String message) {
        return ApiResponse.<T>builder()
                .success(true)
                .data(data)
                .message(message)
                .build();
    }
    
    /**
     * Static method to create an error response
     */
    public static <T> ApiResponse<T> error(String message, String errorCode) {
        return ApiResponse.<T>builder()
                .success(false)
                .message(message)
                .errorCode(errorCode)
                .build();
    }
}
