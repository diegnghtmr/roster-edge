package co.edu.uniquindio.rosteredge.backend.match;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import co.edu.uniquindio.rosteredge.backend.controller.MatchController;
import co.edu.uniquindio.rosteredge.backend.exception.GlobalExceptionHandler;
import co.edu.uniquindio.rosteredge.backend.repository.MatchRepository;
import co.edu.uniquindio.rosteredge.backend.repository.view.MatchScheduleQueryRepository;
import co.edu.uniquindio.rosteredge.backend.repository.view.NotificationQueryRepository;
import co.edu.uniquindio.rosteredge.backend.service.impl.MatchServiceImpl;
import co.edu.uniquindio.rosteredge.backend.service.impl.NotificationServiceImpl;
import co.edu.uniquindio.rosteredge.backend.service.notification.MatchNotificationPublisher;
import co.edu.uniquindio.rosteredge.backend.service.notification.MatchTeamAssignmentService;
import co.edu.uniquindio.rosteredge.backend.service.notification.NotificationClubEventLinkService;
import com.fasterxml.jackson.databind.SerializationFeature;
import javax.sql.DataSource;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.context.annotation.AnnotationConfigApplicationContext;
import org.springframework.context.annotation.Bean;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Import;
import org.springframework.data.jdbc.repository.config.AbstractJdbcConfiguration;
import org.springframework.data.jdbc.repository.config.EnableJdbcRepositories;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.Jackson2ObjectMapperBuilder;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.jdbc.datasource.SingleConnectionDataSource;
import org.springframework.jdbc.support.JdbcTransactionManager;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.EnableTransactionManagement;

class MatchPersistenceTest {

    private AnnotationConfigApplicationContext context;
    private JdbcTemplate jdbc;
    private MockMvc mvc;

    @BeforeEach
    void setUp() {
        context = new AnnotationConfigApplicationContext();
        context.register(JdbcConfig.class);
        context.refresh();
        jdbc = context.getBean(JdbcTemplate.class);
        mvc = MockMvcBuilders.standaloneSetup(context.getBean(MatchController.class))
                .setControllerAdvice(new GlobalExceptionHandler())
                .setMessageConverters(new MappingJackson2HttpMessageConverter(Jackson2ObjectMapperBuilder.json()
                        .featuresToDisable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS).build()))
                .build();
    }

    @AfterEach
    void close() {
        context.close();
    }

    @Test
    void rollsBackMatchAndHomeAssignmentWhenAwayInsertFails() throws Exception {
        jdbc.execute("ALTER TABLE \"MatchAwayTeam\" ADD CHECK (team_id <> 21)");

        expectFailedWrite(mvc.perform(post("/matches/").contentType(MediaType.APPLICATION_JSON)
                .content(fixture(21, "2031-01-01"))));

        assertEmpty("Match", "MatchHomeTeam", "MatchAwayTeam", "Notification", "NotificationClubEvent", "ClubEvent");
    }

    @Test
    void rollsBackWholeUpdateWhenAwayInsertFails() throws Exception {
        createFixture();
        jdbc.execute("ALTER TABLE \"MatchAwayTeam\" ADD CHECK (team_id <> 22)");

        expectFailedWrite(mvc.perform(put("/matches/1/").contentType(MediaType.APPLICATION_JSON)
                .content(fixture(22, "2031-03-01"))));

        mvc.perform(get("/matches/schedule/"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.length()").value(1))
                .andExpect(jsonPath("$.data[0].date").value("2031-01-01"))
                .andExpect(jsonPath("$.data[0].homeTeamId").value(11))
                .andExpect(jsonPath("$.data[0].awayTeamId").value(21));
        assertThat(count("Notification")).isEqualTo(1);
    }

    @Test
    void exposesNotificationFailureAndRollsBackAllWrites() throws Exception {
        jdbc.execute("ALTER TABLE \"NotificationClubEvent\" ADD CHECK (false)");

        expectFailedWrite(mvc.perform(post("/matches/").contentType(MediaType.APPLICATION_JSON)
                .content(fixture(21, "2031-01-01"))));

        assertEmpty("Match", "MatchHomeTeam", "MatchAwayTeam", "Notification", "NotificationClubEvent", "ClubEvent");
    }

    @Test
    void rejectsUnknownTeamWithoutCreatingAnything() throws Exception {
        mvc.perform(post("/matches/").contentType(MediaType.APPLICATION_JSON).content(fixture(999, "2031-01-01")))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("Team not found with id: 999"))
                .andExpect(jsonPath("$.code").value("BUSINESS_ERROR"));

        assertEmpty("Match", "MatchHomeTeam", "MatchAwayTeam", "Notification", "NotificationClubEvent", "ClubEvent");
    }

    @Test
    void createsNotificationOnceAndUpdatesFixtureWithoutReissuingIt() throws Exception {
        createFixture();
        assertThat(count("Notification")).isEqualTo(1);
        assertThat(count("NotificationClubEvent")).isEqualTo(2);

        mvc.perform(put("/matches/1/").contentType(MediaType.APPLICATION_JSON).content(fixture(22, "2031-02-01")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Match updated successfully"));
        mvc.perform(get("/matches/schedule/"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data[0].date").value("2031-02-01"))
                .andExpect(jsonPath("$.data[0].homeTeamId").value(11))
                .andExpect(jsonPath("$.data[0].awayTeamId").value(22));
        assertThat(count("Notification")).isEqualTo(1);
        assertThat(count("NotificationClubEvent")).isEqualTo(2);
    }

    private void expectFailedWrite(ResultActions result) throws Exception {
        result.andExpect(status().isInternalServerError())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("An unexpected error occurred"))
                .andExpect(jsonPath("$.code").isEmpty());
    }

    private void createFixture() throws Exception {
        mvc.perform(post("/matches/").contentType(MediaType.APPLICATION_JSON).content(fixture(21, "2031-01-01")))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.message").value("Match created successfully"))
                .andExpect(jsonPath("$.data.id").value(1));
    }

    private long count(String table) {
        return jdbc.queryForObject("SELECT COUNT(*) FROM \"" + table + "\"", Long.class);
    }

    private void assertEmpty(String... tables) {
        for (String table : tables) {
            assertThat(count(table)).as(table).isZero();
        }
    }

    private String fixture(long awayTeam, String date) {
        return """
                {"matchdayId":1,"eventId":1,"stadiumId":1,"homeTeamId":11,"awayTeamId":%d,
                 "date":"%s","startTime":"13:00","endTime":"15:00","active":true}
                """.formatted(awayTeam, date);
    }

    @TestConfiguration(proxyBeanMethods = false)
    @EnableTransactionManagement
    @EnableJdbcRepositories(basePackageClasses = MatchRepository.class)
    @Import({MatchController.class, MatchServiceImpl.class, MatchTeamAssignmentService.class,
            MatchScheduleQueryRepository.class, NotificationServiceImpl.class, NotificationQueryRepository.class,
            MatchNotificationPublisher.class, NotificationClubEventLinkService.class})
    static class JdbcConfig extends AbstractJdbcConfiguration {

        @Bean
        SingleConnectionDataSource dataSource() { return PostgresMatchFixture.connect(); }

        @Bean
        JdbcTemplate jdbcTemplate(DataSource source) { return new JdbcTemplate(source); }

        @Bean
        NamedParameterJdbcTemplate namedParameterJdbcTemplate(JdbcTemplate jdbc) {
            return new NamedParameterJdbcTemplate(jdbc);
        }

        @Bean
        JdbcTransactionManager transactionManager(DataSource source) { return new JdbcTransactionManager(source); }
    }
}
