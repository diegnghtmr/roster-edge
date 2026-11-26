package co.edu.uniquindio.rosteredge.backend.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.MockMvcPrint;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.runner.ApplicationContextRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.Base64;
import java.util.HexFormat;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc(print = MockMvcPrint.NONE)
@Transactional
class RosterCredentialTests {

    private static final String EMAIL = "upgrade@example.invalid";
    private static final String PASSWORD = "A synthetic passphrase for the fixture";

    @Autowired MockMvc mvc;
    @Autowired JdbcTemplate jdbc;
    @Autowired PasswordHasher hashes;

    @Test
    void productionCannotStartWithoutSigningSecret() {
        new ApplicationContextRunner().withUserConfiguration(TokenService.class)
                .withPropertyValues("spring.profiles.active=prod")
                .run(context -> assertThat(context).hasFailed());
        new ApplicationContextRunner().withUserConfiguration(TokenService.class)
                .withPropertyValues("spring.profiles.active=prod", "security.token.secret=short-test-input")
                .run(context -> assertThat(context).hasFailed());
        new ApplicationContextRunner().withUserConfiguration(TokenService.class)
                .withPropertyValues("spring.profiles.active=test,prod")
                .run(context -> assertThat(context).hasFailed());
    }

    @Test
    void passwordEncodingIsSaltedAndVerifiesUnicode() {
        String first = hashes.hash("rotación 🐢");
        String second = hashes.hash("rotación 🐢");
        assertThat(first).isNotEqualTo(second);
        assertThat(hashes.matches("rotación 🐢", first)).isTrue();
        assertThat(hashes.matches("rotación 🐢", second)).isTrue();
        assertThat(hashes.matches("wrong", first)).isFalse();
    }

    @Test
    void onlySuccessfulLegacyLoginRehashesAndNoRosterResponseReturnsCredentials() throws Exception {
        byte[] digest = MessageDigest.getInstance("SHA-256").digest(PASSWORD.getBytes(StandardCharsets.UTF_8));
        String legacy = Base64.getEncoder().encodeToString(digest);
        long club = jdbc.queryForObject("INSERT INTO \"Club\" (name, foundation) VALUES ('Fixture', current_date) RETURNING id", Long.class);
        long subscription = jdbc.queryForObject("INSERT INTO \"Subscription\" (start_date, end_date) VALUES (current_date, current_date) RETURNING id", Long.class);
        long roster = jdbc.queryForObject("""
                INSERT INTO "Roster" (name, email, password_hash, club_id, subscription_id, last_access)
                VALUES ('Test Admin', ?, ?, ?, ?, DATE '2000-01-01') RETURNING id
                """, Long.class, EMAIL, legacy, club, subscription);

        mvc.perform(post("/roster/login/").contentType("application/json")
                .content("{\"email\":\"" + EMAIL + "\",\"password\":\"wrong\"}"))
                .andExpect(status().isUnauthorized()).andExpect(jsonPath("$.message").value("Invalid credentials"));
        assertThat(storedHash(roster)).isEqualTo(legacy);
        assertThat(jdbc.queryForObject("SELECT last_access::text FROM \"Roster\" WHERE id = ?", String.class, roster))
                .isEqualTo("2000-01-01");

        String header = "Bearer " + login();
        String migrated = storedHash(roster);
        assertThat(migrated).isNotEqualTo(legacy);
        assertThat(hashes.matches(PASSWORD, migrated)).isTrue();
        login();
        assertThat(storedHash(roster)).isEqualTo(migrated);
        jdbc.update("UPDATE \"Roster\" SET password_hash = ? WHERE id = ?", HexFormat.of().formatHex(digest), roster);
        login();
        assertThat(storedHash(roster)).isNotEqualTo(legacy).isNotEqualTo(HexFormat.of().formatHex(digest));

        mvc.perform(get("/rosters/{id}/", roster).header("Authorization", header)).andExpect(status().isOk())
                .andExpect(jsonPath("$.data.passwordHash").doesNotHaveJsonPath())
                .andExpect(jsonPath("$.data.password").doesNotHaveJsonPath());
        mvc.perform(get("/rosters/").header("Authorization", header)).andExpect(status().isOk())
                .andExpect(jsonPath("$.data[0].id").value(roster))
                .andExpect(jsonPath("$.data[0].passwordHash").doesNotHaveJsonPath());
        mvc.perform(put("/rosters/{id}/", roster).header("Authorization", header).contentType("application/json")
                .content("{\"name\":\"New Display Name\",\"email\":\"" + EMAIL + "\",\"subscriptionId\":" + subscription + ",\"clubId\":" + club + "}"))
                .andExpect(status().isOk()).andExpect(jsonPath("$.data.name").value("New Display Name"))
                .andExpect(jsonPath("$.data.passwordHash").doesNotHaveJsonPath());
        mvc.perform(get("/roster/me/").header("Authorization", header)).andExpect(status().isOk())
                .andExpect(jsonPath("$.data.name").value("New Display Name"));
        mvc.perform(post("/roster/logout/").header("Authorization", header)).andExpect(status().isOk());
        mvc.perform(get("/roster/me/").header("Authorization", header)).andExpect(status().isUnauthorized());
    }

    @Test
    void authenticatedRosterDetailDoesNotSerializeCredentialFields() throws Exception {
        long club = jdbc.queryForObject("INSERT INTO \"Club\" (name, foundation) VALUES ('DTO Fixture', current_date) RETURNING id", Long.class);
        byte[] digest = MessageDigest.getInstance("SHA-256").digest(PASSWORD.getBytes(StandardCharsets.UTF_8));
        long roster = jdbc.queryForObject("""
                INSERT INTO "Roster" (name, email, password_hash, club_id) VALUES ('DTO Test Admin', ?, ?, ?) RETURNING id
                """, Long.class, EMAIL, Base64.getEncoder().encodeToString(digest), club);
        mvc.perform(get("/rosters/{id}/", roster).header("Authorization", "Bearer " + login()))
                .andExpect(status().isOk()).andExpect(jsonPath("$.data.id").value(roster))
                .andExpect(jsonPath("$.data.passwordHash").doesNotHaveJsonPath())
                .andExpect(jsonPath("$.data.password").doesNotHaveJsonPath());
    }

    @Test
    void staffWriteUsesAnAdaptiveHashAndCreateDetailAndListNeverEchoIt() throws Exception {
        long club = jdbc.queryForObject("INSERT INTO \"Club\" (name, foundation) VALUES ('Staff Fixture', current_date) RETURNING id", Long.class);
        jdbc.update("INSERT INTO \"Roster\" (name, email, password_hash, club_id) VALUES ('Staff Fixture Admin', ?, ?, ?)",
                EMAIL, hashes.hash(PASSWORD), club);
        long team = jdbc.queryForObject("INSERT INTO \"Team\" (name, foundation, club_id) VALUES ('Staff XI', current_date, ?) RETURNING id", Long.class, club);
        long role = jdbc.queryForObject("INSERT INTO \"StaffRole\" (name) VALUES ('Credential Fixture Coach') RETURNING id", Long.class);
        long city = jdbc.queryForObject("INSERT INTO \"City\" (name) VALUES ('Fixture City') RETURNING id", Long.class);
        String header = "Bearer " + login();
        String created = mvc.perform(post("/staff/").header("Authorization", header).contentType("application/json")
                        .content("""
                                {"name":"Fixture","lastName":"Coach","email":"staff@example.invalid","birthDate":"1985-02-03",
                                 "cityId":%d,"teamId":%d,"staffRoleId":%d,"passwordHash":"%s"}
                                """.formatted(city, team, role, PASSWORD)))
                .andExpect(status().isCreated()).andExpect(jsonPath("$.data.passwordHash").doesNotHaveJsonPath())
                .andReturn().getResponse().getContentAsString();
        long id = new ObjectMapper().readTree(created).required("data").required("id").asLong();
        String stored = jdbc.queryForObject("SELECT password_hash FROM \"Staff\" WHERE id = ?", String.class, id);
        assertThat(stored).isNotEqualTo(PASSWORD);
        assertThat(hashes.matches(PASSWORD, stored)).isTrue();
        mvc.perform(get("/staff/{id}/", id).header("Authorization", header)).andExpect(status().isOk())
                .andExpect(jsonPath("$.data.passwordHash").doesNotHaveJsonPath());
        mvc.perform(get("/staff/").header("Authorization", header)).andExpect(status().isOk())
                .andExpect(jsonPath("$.data[0].id").value(id))
                .andExpect(jsonPath("$.data[0].passwordHash").doesNotHaveJsonPath());
    }

    private String login() throws Exception {
        String response = mvc.perform(post("/roster/login/").contentType("application/json")
                        .content("{\"email\":\"" + EMAIL + "\",\"password\":\"" + PASSWORD + "\"}"))
                .andExpect(status().isOk()).andExpect(jsonPath("$.message").value("Login successful"))
                .andReturn().getResponse().getContentAsString();
        return new ObjectMapper().readTree(response).required("data").required("token").asText();
    }

    private String storedHash(long roster) {
        return jdbc.queryForObject("SELECT password_hash FROM \"Roster\" WHERE id = ?", String.class, roster);
    }
}
