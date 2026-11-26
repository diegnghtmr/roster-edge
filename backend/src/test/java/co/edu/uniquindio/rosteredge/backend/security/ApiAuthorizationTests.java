package co.edu.uniquindio.rosteredge.backend.security;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.MockMvcPrint;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc(print = MockMvcPrint.NONE)
@Transactional
class ApiAuthorizationTests {

    @Autowired MockMvc mvc;
    @Autowired JdbcTemplate jdbc;
    @Autowired TokenService tokens;
    @Autowired RosterSessionService sessions;

    long club;
    long foreignClub;
    long foreignTeam;
    long ownTeam;
    long gender;
    long category;
    String token;

    @BeforeEach
    void fixtures() {
        club = id("INSERT INTO \"Club\" (name, foundation) VALUES ('Local Club', current_date) RETURNING id");
        foreignClub = id("INSERT INTO \"Club\" (name, foundation) VALUES ('Foreign Club', current_date) RETURNING id");
        ownTeam = id("INSERT INTO \"Team\" (name, foundation, club_id) VALUES ('Local XI', current_date, ?) RETURNING id", club);
        foreignTeam = id("INSERT INTO \"Team\" (name, foundation, club_id) VALUES ('Foreign XI', current_date, ?) RETURNING id", foreignClub);
        gender = id("INSERT INTO \"TeamGender\" (name) VALUES ('Synthetic') RETURNING id");
        category = id("INSERT INTO \"TeamCategory\" (name) VALUES ('Synthetic') RETURNING id");
        jdbc.update("INSERT INTO \"Roster\" (name, email, password_hash, club_id) VALUES ('Local Admin', 'local@example.invalid', 'unused', ?)", club);
        var details = tokens.generateToken("local@example.invalid");
        token = details.token();
        sessions.register(token, details.subject(), details.expiresAt());
    }

    @Test
    void onlyExplicitPublicRoutesWorkWithoutAnActiveSession() throws Exception {
        mvc.perform(get("/health/")).andExpect(status().isOk()).andExpect(jsonPath("$.status").value("UP"));
        mvc.perform(get("/health/version/")).andExpect(status().isOk()).andExpect(jsonPath("$.api").value("RosterEdge API"));
        mvc.perform(options("/teams/").header("Origin", "http://localhost:5173")
                        .header("Access-Control-Request-Method", "GET").header("Access-Control-Request-Headers", "Authorization"))
                .andExpect(status().isOk()).andExpect(header().string("Access-Control-Allow-Origin", "http://localhost:5173"));
        mvc.perform(get("/teams/")).andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.errorCode").value("UNAUTHORIZED"));
        mvc.perform(get("/matches/").header("Authorization", "Bearer invalid"))
                .andExpect(status().isUnauthorized()).andExpect(jsonPath("$.errorCode").value("UNAUTHORIZED"));
        sessions.register(token, "local@example.invalid", 1);
        mvc.perform(get("/teams/").header("Authorization", bearer())).andExpect(status().isUnauthorized());
    }

    @Test
    void inferredClubScopesListAndDirectReads() throws Exception {
        mvc.perform(get("/teams/").param("clubId", String.valueOf(foreignClub)).header("Authorization", bearer()))
                .andExpect(status().isOk()).andExpect(jsonPath("$.data", hasSize(1)))
                .andExpect(jsonPath("$.data[0].id").value(ownTeam));
        mvc.perform(get("/teams/{id}/", foreignTeam).header("Authorization", bearer()))
                .andExpect(status().isNotFound());
        mvc.perform(get("/teams/{id}/", ownTeam).header("Authorization", bearer()))
                .andExpect(status().isOk()).andExpect(jsonPath("$.data.name").value("Local XI"));
    }

    @Test
    void writesUsePrincipalClubAndRejectForeignTargetsAndAssignments() throws Exception {
        mvc.perform(post("/teams/").contentType("application/json").content(teamBody(club)))
                .andExpect(status().isUnauthorized());
        mvc.perform(post("/teams/").header("Authorization", bearer()).contentType("application/json").content(teamBody(club)))
                .andExpect(status().isCreated()).andExpect(jsonPath("$.data.clubId").value(club));
        mvc.perform(put("/teams/{id}/", foreignTeam).header("Authorization", bearer())
                        .contentType("application/json").content(teamBody(club)))
                .andExpect(status().isNotFound());
        mvc.perform(post("/teams/").header("Authorization", bearer()).contentType("application/json").content(teamBody(foreignClub)))
                .andExpect(status().isNotFound());
        mvc.perform(post("/matches/").header("Authorization", bearer()).contentType("application/json").content("""
                {"matchdayId":1,"eventId":1,"stadiumId":1,"date":"2030-01-01","startTime":"14:00",
                 "endTime":"15:00","homeTeamId":%d,"awayTeamId":%d,"active":true}
                """.formatted(ownTeam, foreignTeam))).andExpect(status().isNotFound());
        mvc.perform(get("/teams/").header("Authorization", bearer())).andExpect(status().isOk())
                .andExpect(jsonPath("$.data", hasSize(2)));
    }

    @Test
    void reportReceivesPrincipalClubInsteadOfClientClub() throws Exception {
        long localEvent = event(club, "Local Fixture");
        event(foreignClub, "Foreign Fixture");
        mvc.perform(get("/analytics/reports/season-agenda/").param("clubId", String.valueOf(foreignClub))
                        .header("Authorization", bearer())).andExpect(status().isOk())
                .andExpect(jsonPath("$.data", hasSize(1))).andExpect(jsonPath("$.data[0].eventId").value(localEvent));
    }

    @Test
    void existingMatchListAndAssignmentReadsStayUsableWithinTheClub() throws Exception {
        long localMatch = match(event(club, "Local Fixture"));
        long foreignMatch = match(event(foreignClub, "Foreign Fixture"));
        jdbc.update("INSERT INTO \"MatchHomeTeam\" (match_id, team_id) VALUES (?, ?), (?, ?)",
                localMatch, ownTeam, foreignMatch, foreignTeam);
        mvc.perform(get("/matches/").header("Authorization", bearer())).andExpect(status().isOk())
                .andExpect(jsonPath("$.data", hasSize(1))).andExpect(jsonPath("$.data[0].id").value(localMatch));
        mvc.perform(get("/match-home-teams/").header("Authorization", bearer())).andExpect(status().isOk())
                .andExpect(jsonPath("$.data", hasSize(1))).andExpect(jsonPath("$.data[0].matchId").value(localMatch));
    }

    private long event(long owner, String name) {
        long season = id("INSERT INTO \"Season\" (club_id, name, start_date, end_date) VALUES (?, 'Season', current_date, current_date + 2) RETURNING id", owner);
        return id("INSERT INTO \"Event\" (season_id, name, date) VALUES (?, ?, current_date + 1) RETURNING id", season, name);
    }

    private long match(long event) {
        return id("INSERT INTO \"Match\" (event_id, date, start_time, end_time) VALUES (?, current_date + 1, TIME '10:00', TIME '11:00') RETURNING id", event);
    }

    private String teamBody(long requestedClub) {
        return """
                {"name":"New XI","foundation":"2020-01-01","clubId":%d,"genderId":%d,"categoryId":%d}
                """.formatted(requestedClub, gender, category);
    }

    private String bearer() {
        return "Bearer " + token;
    }

    private long id(String sql, Object... args) {
        return jdbc.queryForObject(sql, Long.class, args);
    }
}
