package co.edu.uniquindio.rosteredge.backend.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.HashMap;
import java.util.Map;

/**
 * Base controller with common utility methods
 * Other controllers can extend this class to reuse functionality
 */
public abstract class BaseController {
    
    /**
     * Creates a successful response with data
     * 
     * @param data The data to return
     * @return ResponseEntity with data and status 200
     */
    protected <T> ResponseEntity<Map<String, Object>> successResponse(T data) {
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("data", data);
        return ResponseEntity.ok(response);
    }
    
    /**
     * Creates a successful response with message
     * 
     * @param message The message to return
     * @return ResponseEntity with message and status 200
     */
    protected ResponseEntity<Map<String, Object>> successResponse(String message) {
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", message);
        return ResponseEntity.ok(response);
    }
    
    /**
     * Creates an error response
     * 
     * @param message The error message
     * @param status The HTTP status code
     * @return ResponseEntity with error and specified status
     */
    protected ResponseEntity<Map<String, Object>> errorResponse(String message, HttpStatus status) {
        Map<String, Object> response = new HashMap<>();
        response.put("success", false);
        response.put("error", message);
        return ResponseEntity.status(status).body(response);
    }
}
