package co.edu.uniquindio.rosteredge.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.Arrays;

/**
 * CORS configuration to allow communication between frontend and backend
 * Allows the frontend (typically on port 3000 or 5173) to make requests to the backend
 */
@Configuration
public class CorsConfig {

    @Bean
    public CorsFilter corsFilter() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();
        
        // Allow credentials
        config.setAllowCredentials(true);
        
        // Allowed origins (adjust according to frontend port)
        config.setAllowedOrigins(Arrays.asList(
            "http://localhost:3000",  // React default
            "http://localhost:5173",  // Vite default
            "http://localhost:4200"   // Angular default
        ));
        
        // Allowed HTTP methods
        config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
        
        // Allowed headers
        config.setAllowedHeaders(Arrays.asList("*"));
        
        // Headers exposed to frontend
        config.setExposedHeaders(Arrays.asList("Content-Type", "Authorization"));
        
        source.registerCorsConfiguration("/**", config);
        return new CorsFilter(source);
    }
}
