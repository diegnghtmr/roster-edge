package co.edu.uniquindio.rosteredge.backend.database;

import co.edu.uniquindio.rosteredge.backend.RosterEdgeBackendApplication;
import org.junit.jupiter.api.Test;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.datasource.DriverManagerDataSource;

import java.util.List;
import java.util.Objects;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertAll;

class DatabaseBootstrapTests {

    @Test
    void emptyDatabaseAndRestartAreVersionedAndAdvanceImportedSequencesWithoutRewinding() {
        String baseUrl = "jdbc:postgresql://127.0.0.1:%s/%s".formatted(
                System.getenv().getOrDefault("POSTGRES_PORT", "5431"),
                System.getenv().getOrDefault("POSTGRES_DB", "roster_db"));
        String user = Objects.requireNonNull(System.getenv("POSTGRES_USER"), "POSTGRES_USER is required");
        String password = System.getenv().getOrDefault("POSTGRES_PASSWORD", "");
        String schema = "bootstrap_" + UUID.randomUUID().toString().replace("-", "");
        var root = new JdbcTemplate(new DriverManagerDataSource(baseUrl, user, password));
        String url = baseUrl + "?currentSchema=" + schema;
        root.execute("CREATE SCHEMA " + schema);
        try {
            int firstConstraints;
            List<String> firstMigrations;
            try (var ctx = start(url, user, password)) {
                var jdbc = ctx.getBean(JdbcTemplate.class);
                firstConstraints = foreignKeys(jdbc);
                firstMigrations = migrations(jdbc);
                assertThat(firstMigrations).containsExactly("001:true", "003:true", "004:true");
                assertThat(firstConstraints).isPositive();
                assertThat(jdbc.queryForObject("SELECT COUNT(*) FROM \"Roster\"", Long.class)).isZero();
                assertThat(jdbc.queryForObject("SELECT COUNT(*) FROM \"Team\"", Long.class)).isZero();
                jdbc.update("INSERT INTO \"Team\" (id, name, foundation) VALUES (1, 'Imported', current_date)");
                jdbc.update("INSERT INTO \"Notification\" (id, message) VALUES (1, 'Imported')");
                jdbc.queryForObject("SELECT setval('\"Match_id_seq\"', 101, true)", Long.class);
            }
            try (var ctx = start(url, user, password)) {
                var jdbc = ctx.getBean(JdbcTemplate.class);
                assertAll(
                        () -> assertThat(foreignKeys(jdbc)).isEqualTo(firstConstraints),
                        () -> assertThat(migrations(jdbc)).containsExactlyElementsOf(firstMigrations),
                        () -> assertThat(jdbc.queryForObject("INSERT INTO \"Team\" (name, foundation) VALUES ('Generated', current_date) RETURNING id", Long.class)).isGreaterThan(1),
                        () -> assertThat(jdbc.queryForObject("INSERT INTO \"Notification\" (message) VALUES ('Generated') RETURNING id", Long.class)).isGreaterThan(1),
                        () -> assertThat(jdbc.queryForObject("SELECT nextval('\"Match_id_seq\"')", Long.class)).isGreaterThan(101));
            }
        } finally {
            root.execute("DROP SCHEMA " + schema + " CASCADE");
        }
    }

    private static ConfigurableApplicationContext start(String url, String user, String password) {
        return new SpringApplicationBuilder(RosterEdgeBackendApplication.class).run(
                "--spring.profiles.active=test", "--server.port=0", "--spring.datasource.url=" + url,
                "--spring.datasource.username=" + user, "--spring.datasource.password=" + password,
                "--logging.level.org.springframework.jdbc=INFO");
    }

    private static List<String> migrations(JdbcTemplate jdbc) {
        return jdbc.queryForList("SELECT version || ':' || success FROM flyway_schema_history WHERE version IS NOT NULL ORDER BY installed_rank", String.class);
    }

    private static int foreignKeys(JdbcTemplate jdbc) {
        return jdbc.queryForObject("""
                SELECT COUNT(*) FROM pg_constraint c JOIN pg_namespace n ON n.oid = c.connamespace
                WHERE c.contype = 'f' AND n.nspname = current_schema()
                """, Integer.class);
    }
}
