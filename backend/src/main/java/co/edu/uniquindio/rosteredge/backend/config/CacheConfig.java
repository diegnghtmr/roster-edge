package co.edu.uniquindio.rosteredge.backend.config;

import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.Configuration;

/**
 * Cache configuration using Caffeine
 */
@Configuration
@EnableCaching
public class CacheConfig {
    // Cache configuration is handled via application.properties
    // Additional cache configurations can be added here if needed
}
