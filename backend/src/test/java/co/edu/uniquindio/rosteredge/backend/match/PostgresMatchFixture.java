package co.edu.uniquindio.rosteredge.backend.match;

import java.nio.charset.StandardCharsets;
import java.util.Objects;
import org.springframework.core.io.ClassPathResource;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.datasource.SingleConnectionDataSource;

/** Each fixture owns a single PostgreSQL session; its temporary tables disappear on close. */
public final class PostgresMatchFixture {

    public static SingleConnectionDataSource connect() {
        var source = new SingleConnectionDataSource(
                "jdbc:postgresql://127.0.0.1:%s/%s".formatted(System.getenv().getOrDefault("POSTGRES_PORT", "5431"),
                        System.getenv().getOrDefault("POSTGRES_DB", "roster_db")),
                Objects.requireNonNull(System.getenv("POSTGRES_USER"), "POSTGRES_USER is required"),
                System.getenv().getOrDefault("POSTGRES_PASSWORD", ""), true);
        try {
            var jdbc = new JdbcTemplate(source);
            jdbc.execute("SET search_path TO pg_temp");
            applyTemporaryMigration(jdbc, "V001__baseline.sql");
            applyTemporaryMigration(jdbc, "V003__match_result_state.sql");
            jdbc.execute("""
                    INSERT INTO "Club" (id, name, foundation) VALUES
                        (1, 'North', CURRENT_DATE), (2, 'South', CURRENT_DATE);
                    INSERT INTO "Team" (id, name, foundation, club_id) VALUES
                        (11, 'North A', CURRENT_DATE, 1), (12, 'North B', CURRENT_DATE, 1),
                        (21, 'South A', CURRENT_DATE, 2), (22, 'South B', CURRENT_DATE, 2);
                    INSERT INTO "Season" (id, club_id, name, start_date, end_date)
                        VALUES (1, 1, 'League season', CURRENT_DATE - 30, CURRENT_DATE + 30);
                    INSERT INTO "Event" (id, season_id, name, date)
                        VALUES (1, 1, 'League event', CURRENT_DATE);
                    INSERT INTO "Matchday" (id, name) VALUES (1, 'Opening round');
                    INSERT INTO "Stadium" (id, area, surface, total_capacity, foundation)
                        VALUES (1, 1000, 'grass', 100, CURRENT_DATE);
                    """);
            return source;
        } catch (Exception exception) {
            source.destroy();
            throw new IllegalStateException("Could not initialize PostgreSQL match fixtures", exception);
        }
    }

    private static void applyTemporaryMigration(JdbcTemplate jdbc, String filename) throws java.io.IOException {
        // Let PostgreSQL parse dollar-quoted DO blocks; a semicolon splitter cannot handle them.
        var script = new ClassPathResource("db/migration/" + filename);
        jdbc.execute(script.getContentAsString(StandardCharsets.UTF_8)
                .replace("CREATE TABLE ", "CREATE TEMP TABLE ")
                .replace("CREATE VIEW ", "CREATE TEMP VIEW "));
    }

    private PostgresMatchFixture() { }
}
