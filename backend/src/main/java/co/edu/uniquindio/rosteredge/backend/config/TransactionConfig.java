package co.edu.uniquindio.rosteredge.backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.transaction.annotation.EnableTransactionManagement;

/**
 * Transaction management configuration
 */
@Configuration
@EnableTransactionManagement
public class TransactionConfig {
    // Transaction configuration with default rollback rules
    // Additional transaction configurations can be added here if needed
}
