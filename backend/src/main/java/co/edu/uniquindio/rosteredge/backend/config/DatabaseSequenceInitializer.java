package co.edu.uniquindio.rosteredge.backend.config;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.sql.init.dependency.DependsOnDatabaseInitialization;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

@Component
@DependsOnDatabaseInitialization
@RequiredArgsConstructor
public class DatabaseSequenceInitializer {

    private final JdbcTemplate jdbc;

    @PostConstruct
    public void reconcileImportedIds() {
        jdbc.queryForObject("SELECT sync_roster_identity_sequences()", Integer.class);
    }
}
