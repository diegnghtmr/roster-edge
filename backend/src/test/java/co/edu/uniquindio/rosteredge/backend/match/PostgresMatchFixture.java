package co.edu.uniquindio.rosteredge.backend.match;

import java.nio.charset.StandardCharsets;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.ClassPathResource;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.datasource.SingleConnectionDataSource;
import org.springframework.jdbc.datasource.init.ResourceDatabasePopulator;

/** Each fixture owns a single PostgreSQL session; its temporary tables disappear on close. */
public final class PostgresMatchFixture {

    public static SingleConnectionDataSource connect() {
        var source = new SingleConnectionDataSource(
                System.getProperty("rosteredge.test.jdbc-url", "jdbc:postgresql://127.0.0.1:5417/rosteredge_b"),
                System.getProperty("rosteredge.test.jdbc-user", "roster_audit"),
                System.getProperty("rosteredge.test.jdbc-password", ""), true);
        try {
            var baseline = new ClassPathResource("db/migration/V001__baseline.sql");
            applyTemporarySchema(source, baseline.exists() ? baseline : new ClassPathResource("schema.sql"));
            applyTemporarySchema(source, new ClassPathResource("db/migration/V003__match_result_state.sql"));
            new JdbcTemplate(source).execute("""
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

    private static void applyTemporarySchema(SingleConnectionDataSource source, ClassPathResource script)
            throws java.io.IOException {
        String sql = script.getContentAsString(StandardCharsets.UTF_8)
                .replace("CREATE TABLE ", "CREATE TEMP TABLE ");
        new ResourceDatabasePopulator(new ByteArrayResource(sql.getBytes(StandardCharsets.UTF_8))).execute(source);
    }

    private PostgresMatchFixture() { }
}
