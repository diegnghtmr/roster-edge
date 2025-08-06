package co.edu.uniquindio.rosteredge.backend.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

/**
 * Controller to check server status
 * Useful for verifying that the backend is working correctly
 */
@RestController
@RequestMapping("/api/health")
public class HealthController {
    
    /**
     * Endpoint to verify that the server is active
     * GET /api/health
     * 
     * @return Message indicating that the server is running
     */
    @GetMapping
    public Map<String, String> checkHealth() {
        Map<String, String> response = new HashMap<>();
        response.put("status", "UP");
        response.put("message", "Backend is running successfully");
        response.put("timestamp", String.valueOf(System.currentTimeMillis()));
        return response;
    }
    
    /**
     * Endpoint to check API version
     * GET /api/health/version
     * 
     * @return Version information
     */
    @GetMapping("/version")
    public Map<String, String> getVersion() {
        Map<String, String> response = new HashMap<>();
        response.put("version", "1.0.0");
        response.put("api", "RosterEdge API");
        return response;
    }
}
