package co.edu.uniquindio.rosteredge.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.core.JdbcTemplate;
import javax.sql.DataSource;

/**
 * SQLite database configuration
 * Defines beans and configurations related to data access
 */
@Configuration
public class DatabaseConfig {
    
    /**
     * JdbcTemplate bean for database operations
     * Spring Data JDBC will use it automatically
     */
    @Bean
    public JdbcTemplate jdbcTemplate(DataSource dataSource) {
        return new JdbcTemplate(dataSource);
    }
    
    // Additional database configurations can be added here as needed
    // For example: transaction configuration, connection pools, etc.
}
