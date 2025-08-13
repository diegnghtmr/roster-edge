package co.edu.uniquindio.rosteredge.backend.controller;

import co.edu.uniquindio.rosteredge.backend.exception.UnauthorizedException;
import co.edu.uniquindio.rosteredge.backend.model.User;
import co.edu.uniquindio.rosteredge.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.HashMap;
import java.util.Map;

/**
 * Base controller with common utility methods
 * Other controllers can extend this class to reuse functionality
 */
public abstract class BaseController {
    
    @Autowired
    private UserService userService;
    
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
    
    /**
     * Validates if the user has admin role
     * 
     * @param token The authorization token
     * @throws UnauthorizedException if user is not admin
     */
    protected void validateAdmin(String token) {
        User user = validateTokenAndGetUser(token);
        if (!"ADMIN".equals(user.getRole())) {
            throw new UnauthorizedException("Admin access required");
        }
    }
    
    /**
     * Validates if the user has admin or coach role
     * 
     * @param token The authorization token
     * @throws UnauthorizedException if user is not admin or coach
     */
    protected void validateAdminOrCoach(String token) {
        User user = validateTokenAndGetUser(token);
        if (!"ADMIN".equals(user.getRole()) && !"COACH".equals(user.getRole())) {
            throw new UnauthorizedException("Admin or Coach access required");
        }
    }
    
    /**
     * Validates the token and returns the user
     * 
     * @param token The authorization token
     * @return The authenticated user
     * @throws UnauthorizedException if token is invalid
     */
    protected User validateTokenAndGetUser(String token) {
        if (token == null || token.isEmpty()) {
            throw new UnauthorizedException("No authorization token provided");
        }
        
        User user = userService.findByAuthToken(token)
                .orElseThrow(() -> new UnauthorizedException("Invalid or expired token"));
        
        return user;
    }
}
