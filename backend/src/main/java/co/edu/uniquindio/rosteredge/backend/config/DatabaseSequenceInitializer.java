package co.edu.uniquindio.rosteredge.backend.config;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

/**
 * Ensures sequences stay aligned with seeded data (mainly for tables populated via data.sql).
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class DatabaseSequenceInitializer {

    private final JdbcTemplate jdbcTemplate;

    @PostConstruct
    public void syncSequences() {
        syncSequence("Match", "\"Match_id_seq\"");
    }

    private void syncSequence(String tableName, String sequenceName) {
        Long nextValue = jdbcTemplate.queryForObject(
                "SELECT COALESCE(MAX(id), 0) + 1 FROM \"" + tableName + "\"",
                Long.class);
        if (nextValue == null || nextValue < 1) {
            nextValue = 1L;
        }
        jdbcTemplate.queryForObject(
                "SELECT setval('" + sequenceName + "', ?, false)",
                Long.class,
                nextValue);
        log.debug("Sequence {} aligned to {}", sequenceName, nextValue);
    }
}
