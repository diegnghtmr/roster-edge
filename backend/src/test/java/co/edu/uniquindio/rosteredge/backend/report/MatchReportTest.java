package co.edu.uniquindio.rosteredge.backend.report;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.contains;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import co.edu.uniquindio.rosteredge.backend.controller.AnalyticsReportController;
import co.edu.uniquindio.rosteredge.backend.controller.MatchResultController;
import co.edu.uniquindio.rosteredge.backend.dto.filter.MatchScheduleFilter;
import co.edu.uniquindio.rosteredge.backend.dto.response.MatchResponse;
import co.edu.uniquindio.rosteredge.backend.exception.GlobalExceptionHandler;
import co.edu.uniquindio.rosteredge.backend.match.PostgresMatchFixture;
import co.edu.uniquindio.rosteredge.backend.repository.report.AnalyticsReportQueryRepository;
import co.edu.uniquindio.rosteredge.backend.repository.view.MatchScheduleQueryRepository;
import co.edu.uniquindio.rosteredge.backend.service.impl.report.AnalyticsReportServiceImpl;
import co.edu.uniquindio.rosteredge.backend.service.report.MatchResultService;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.List;
import javax.sql.DataSource;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.AnnotationConfigApplicationContext;
import org.springframework.context.annotation.Bean;
import org.springframework.http.MediaType;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.jdbc.datasource.SingleConnectionDataSource;
import org.springframework.jdbc.support.JdbcTransactionManager;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.EnableTransactionManagement;

class MatchReportTest {

    private static final String REPORTS = "/analytics/reports/";
    private SingleConnectionDataSource source;
    private AnnotationConfigApplicationContext resultContext;
    private JdbcTemplate jdbc;
    private MatchScheduleQueryRepository schedule;
    private MockMvc mvc;

    @BeforeEach
    void setUp() {
        source = PostgresMatchFixture.connect();
        jdbc = new JdbcTemplate(source);
        var namedJdbc = new NamedParameterJdbcTemplate(jdbc);
        var reports = new AnalyticsReportQueryRepository(namedJdbc, new ObjectMapper());
        schedule = new MatchScheduleQueryRepository(namedJdbc);
        resultContext = new AnnotationConfigApplicationContext();
        resultContext.registerBean(DataSource.class, () -> source, definition -> definition.setDestroyMethodName(""));
        resultContext.registerBean(JdbcTemplate.class, () -> jdbc);
        resultContext.register(ResultTransactions.class, MatchResultService.class, MatchResultController.class);
        resultContext.refresh();
        mvc = MockMvcBuilders.standaloneSetup(new AnalyticsReportController(new AnalyticsReportServiceImpl(reports)),
                        resultContext.getBean(MatchResultController.class))
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();
    }

    @AfterEach
    void close() {
        if (resultContext != null) {
            resultContext.close();
        }
        if (source != null) {
            source.destroy();
        }
    }

    @Test
    void upcomingFixtureIsVisibleButAddsNoPlayedMatchOrPoints() throws Exception {
        match(1, 1, 11, 12, 0, 0);
        mvc.perform(get(REPORTS + "season-standings/"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.length()").value(0));
        var upcoming = new MatchScheduleFilter();
        upcoming.setUpcomingOnly(true);
        assertThat(schedule.findMatches(upcoming)).singleElement().satisfies(fixture -> {
            assertThat(fixture.getUpcoming()).isTrue();
            assertThat(fixture.getPlayed()).isFalse();
            assertThat(fixture.getHomeScore()).isNull();
            assertThat(fixture.getAwayScore()).isNull();
            assertThat(fixture.getResultLabel()).isNull();
        });
    }

    @Test
    void elapsedFixtureAndLegacyScoresDoNotImplyFinalization() throws Exception {
        match(1, -2, 11, 12, 4, 2);
        mvc.perform(get(REPORTS + "season-standings/"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.length()").value(0));
        var played = new MatchScheduleFilter();
        played.setPlayedOnly(true);
        assertThat(schedule.findMatches(played)).isEmpty();
        assertThat(schedule.findMatches(new MatchScheduleFilter()))
                .extracting(MatchResponse::getId).containsExactly(1L);
    }

    @Test
    void finalizedScorelessMatchAwardsOnePointAndPreservesASharedRank() throws Exception {
        match(1, -2, 11, 12, 4, 2);
        match(2, 1, 11, 12, 0, 0);

        recordResult(1, 0, 0);
        recordResult(1, 0, 0);
        mvc.perform(get(REPORTS + "season-standings/"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data[*].teamId").value(contains(11, 12)))
                .andExpect(jsonPath("$.data[*].played").value(contains(1, 1)))
                .andExpect(jsonPath("$.data[*].wins").value(contains(0, 0)))
                .andExpect(jsonPath("$.data[*].draws").value(contains(1, 1)))
                .andExpect(jsonPath("$.data[*].losses").value(contains(0, 0)))
                .andExpect(jsonPath("$.data[*].points").value(contains(1, 1)))
                .andExpect(jsonPath("$.data[*].rankingPosition").value(contains(1, 1)));
        mvc.perform(get(REPORTS + "scoring-ranking/").param("minMatches", "1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data[*].matchesPlayed").value(contains(1, 1)))
                .andExpect(jsonPath("$.data[*].goalsFor").value(contains(0, 0)));
        mvc.perform(get(REPORTS + "points-progress/"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data[*].matchId").value(contains(1, 1)))
                .andExpect(jsonPath("$.data[*].pointsEarned").value(contains(1, 1)));
        mvc.perform(get(REPORTS + "staff-impact/"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.teamDetails[*].matchesPlayed").value(contains(1, 1)));

        var played = new MatchScheduleFilter();
        played.setPlayedOnly(true);
        assertThat(schedule.findMatches(played)).singleElement().satisfies(fixture -> {
            assertThat(fixture.getId()).isEqualTo(1);
            assertThat(fixture.getPlayed()).isTrue();
            assertThat(fixture.getUpcoming()).isFalse();
            assertThat(fixture.getResultLabel()).isEqualTo("0-0");
        });
    }

    @Test
    void standingsBreakPointsTiesByGoalDifferenceThenGoalsScored() throws Exception {
        match(1, -3, 11, 22, 0, 0);
        match(2, -2, 12, 22, 0, 0);
        match(3, -1, 21, 22, 0, 0);
        recordResult(1, 3, 1);
        recordResult(2, 2, 0);
        recordResult(3, 5, 4);

        mvc.perform(get(REPORTS + "season-standings/"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data[*].teamId").value(contains(11, 12, 21, 22)))
                .andExpect(jsonPath("$.data[*].points").value(contains(3, 3, 3, 0)))
                .andExpect(jsonPath("$.data[*].rankingPosition").value(contains(1, 2, 3, 4)));
    }

    @Test
    void rejectsAnIncompleteOrNegativeResultWithoutOverwritingTheScore() throws Exception {
        match(1, -1, 11, 12, 0, 0);
        recordResult(1, 2, 1);
        for (String invalid : List.of("{\"homeScore\":0}", "{\"homeScore\":-1,\"awayScore\":0}")) {
            mvc.perform(put("/matches/1/result/").contentType(MediaType.APPLICATION_JSON).content(invalid))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.errorCode").value("VALIDATION_ERROR"));
        }
        mvc.perform(get(REPORTS + "season-standings/"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data[*].points").value(contains(3, 0)))
                .andExpect(jsonPath("$.data[*].goalsFor").value(contains(2, 1)));
    }

    @Test
    void scheduleDensityScopesTeamsWithoutDroppingUpcomingFixtures() throws Exception {
        match(1, 1, 11, 12, 0, 0);
        match(2, 3, 11, 21, 0, 0);
        match(3, 4, 21, 22, 0, 0);

        mvc.perform(get(REPORTS + "schedule-density/").param("clubId", "1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data[*].teamId").value(contains(11, 11, 12)))
                .andExpect(jsonPath("$.data[*].matchId").value(contains(1, 2, 1)))
                .andExpect(jsonPath("$.data[0].matchesNextSevenDays").value(2))
                .andExpect(jsonPath("$.data[1].restDays").value(2));
    }

    @Test
    void paymentMethodTotalsAndRevenueShareUseOnlyTheRequestedClub() throws Exception {
        financeFixtures();
        mvc.perform(get(REPORTS + "payment-method-performance/").param("clubId", "1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.length()").value(1))
                .andExpect(jsonPath("$.data[0].paymentMethodId").value(1))
                .andExpect(jsonPath("$.data[0].totalPayments").value(1))
                .andExpect(jsonPath("$.data[0].uniqueCustomers").value(1))
                .andExpect(jsonPath("$.data[0].netRevenue").value(90))
                .andExpect(jsonPath("$.data[0].revenueSharePercentage").value(100));
    }

    @Test
    void planPerformanceScopesBothSubscriptionsAndPayments() throws Exception {
        financeFixtures();
        mvc.perform(get(REPORTS + "subscription-plan-performance/").param("clubId", "1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.length()").value(1))
                .andExpect(jsonPath("$.data[0].planId").value(1))
                .andExpect(jsonPath("$.data[0].totalSubscriptions").value(1))
                .andExpect(jsonPath("$.data[0].activeSubscriptions").value(1))
                .andExpect(jsonPath("$.data[0].paymentsCount").value(1))
                .andExpect(jsonPath("$.data[0].netRevenue").value(90))
                .andExpect(jsonPath("$.data[0].arpu").value(90));
    }

    @Test
    void missingClubScopeFailsClosedForAllThreeReports() throws Exception {
        for (String report : List.of("schedule-density/", "payment-method-performance/",
                "subscription-plan-performance/")) {
            mvc.perform(get(REPORTS + report))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.success").value(false))
                    .andExpect(jsonPath("$.message").value("Club ID is required"))
                    .andExpect(jsonPath("$.code").value("BUSINESS_ERROR"));
        }
    }

    private void recordResult(long id, int homeScore, int awayScore) throws Exception {
        mvc.perform(put("/matches/{id}/result/", id).contentType(MediaType.APPLICATION_JSON)
                        .content("{\"homeScore\":%d,\"awayScore\":%d}".formatted(homeScore, awayScore)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Match result recorded successfully"))
                .andExpect(jsonPath("$.data.homeScore").value(homeScore))
                .andExpect(jsonPath("$.data.awayScore").value(awayScore));
    }

    private void match(long id, int daysFromToday, long home, long away, int homeScore, int awayScore) {
        jdbc.update("""
                INSERT INTO "Match" (id, matchday_id, event_id, stadium_id, date, start_time, end_time)
                VALUES (?, 1, 1, 1, CURRENT_DATE + ?, '10:00', '12:00')
                """, id, daysFromToday);
        jdbc.update("INSERT INTO \"MatchHomeTeam\" (match_id, team_id, score) VALUES (?, ?, ?)", id, home, homeScore);
        jdbc.update("INSERT INTO \"MatchAwayTeam\" (match_id, team_id, score) VALUES (?, ?, ?)", id, away, awayScore);
    }

    private void financeFixtures() {
        jdbc.execute("""
                INSERT INTO "Plan" (id, name, price) VALUES (1, 'League plan', 100);
                INSERT INTO "PaymentMethod" (id, name) VALUES (1, 'Card'), (2, 'Transfer');
                INSERT INTO "Subscription" (id, plan_id, start_date, end_date) VALUES
                    (1, 1, CURRENT_DATE - 10, CURRENT_DATE + 10), (2, 1, CURRENT_DATE - 10, CURRENT_DATE + 10);
                INSERT INTO "Roster" (id, name, email, password_hash, club_id, subscription_id) VALUES
                    (1, 'North', 'north@example.invalid', 'fixture-not-a-credential', 1, 1),
                    (2, 'South', 'south@example.invalid', 'fixture-not-a-credential', 2, 2);
                INSERT INTO "Payment" (payment_method_id, plan_id, roster_id, payment_date, amount, discount) VALUES
                    (1, 1, 1, CURRENT_DATE - 1, 100, 10),
                    (1, 1, 2, CURRENT_DATE - 1, 500, 0),
                    (2, 1, 2, CURRENT_DATE - 1, 300, 0);
                """);
    }

    @TestConfiguration(proxyBeanMethods = false)
    @EnableTransactionManagement
    static class ResultTransactions {
        @Bean
        JdbcTransactionManager transactionManager(DataSource source) { return new JdbcTransactionManager(source); }
    }
}
