package co.edu.uniquindio.rosteredge.backend.repository.view;

import co.edu.uniquindio.rosteredge.backend.dto.filter.SubscriptionCoverageFilter;
import co.edu.uniquindio.rosteredge.backend.dto.response.SubscriptionCoverageResponse;
import java.math.BigDecimal;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.LocalDate;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;
import org.springframework.util.StringUtils;

/**
 * Executes subscription coverage joins with derived indicators.
 */
@Repository
@RequiredArgsConstructor
public class SubscriptionCoverageQueryRepository {

    private final NamedParameterJdbcTemplate jdbcTemplate;

    public List<SubscriptionCoverageResponse> findSubscriptions(SubscriptionCoverageFilter filter) {
        MapSqlParameterSource parameters = new MapSqlParameterSource();
        StringBuilder sql = new StringBuilder()
            .append("SELECT r.id AS roster_id, r.name AS roster_name, r.email AS roster_email, \n")
            .append("       r.active AS roster_active, r.creation_date, r.last_access, \n")
            .append("       r.club_id, club.name AS club_name, \n")
            .append("       sub.id AS subscription_id, sub.start_date, sub.end_date, \n")
            .append("       plan.id AS plan_id, plan.name AS plan_name, plan.description AS plan_description, plan.price AS plan_price, \n")
            .append("       status.id AS status_id, status.name AS status_name, \n")
            .append("       GREATEST(0, (sub.end_date - CURRENT_DATE))::int AS days_remaining, \n")
            .append("       CASE WHEN sub.end_date < CURRENT_DATE THEN true ELSE false END AS expired, \n")
            .append("       (SELECT COUNT(*) FROM \"PlanBenefit\" pb WHERE pb.plan_id = plan.id) AS benefit_count \n")
            .append("FROM \"Roster\" r \n")
            .append("LEFT JOIN \"Club\" club ON r.club_id = club.id \n")
            .append("LEFT JOIN \"Subscription\" sub ON r.subscription_id = sub.id \n")
            .append("LEFT JOIN \"Plan\" plan ON sub.plan_id = plan.id \n")
            .append("LEFT JOIN \"SubscriptionStatus\" status ON sub.status_id = status.id \n")
            .append("WHERE 1 = 1");

        if (filter.getClubId() != null) {
            sql.append(" AND r.club_id = :clubId");
            parameters.addValue("clubId", filter.getClubId());
        }
        if (filter.getPlanId() != null) {
            sql.append(" AND sub.plan_id = :planId");
            parameters.addValue("planId", filter.getPlanId());
        }
        if (filter.getStatusId() != null) {
            sql.append(" AND sub.status_id = :statusId");
            parameters.addValue("statusId", filter.getStatusId());
        }
        if (filter.getActive() != null) {
            sql.append(" AND r.active = :active");
            parameters.addValue("active", filter.getActive());
        }
        if (StringUtils.hasText(filter.getSearch())) {
            String pattern = "%" + filter.getSearch().trim().toLowerCase() + "%";
            sql.append(" AND (LOWER(r.name) LIKE :search OR LOWER(r.email) LIKE :search)");
            parameters.addValue("search", pattern);
        }
        if (filter.getExpiresBefore() != null) {
            sql.append(" AND sub.end_date <= :expiresBefore");
            parameters.addValue("expiresBefore", filter.getExpiresBefore());
        }
        if (filter.getExpiresAfter() != null) {
            sql.append(" AND sub.end_date >= :expiresAfter");
            parameters.addValue("expiresAfter", filter.getExpiresAfter());
        }
        if (filter.getExpiringInDays() != null) {
            sql.append(" AND sub.end_date <= CURRENT_DATE + :expiringInDays");
            parameters.addValue("expiringInDays", filter.getExpiringInDays());
        }
        if (filter.getLastAccessBefore() != null) {
            sql.append(" AND r.last_access <= :lastAccessBefore");
            parameters.addValue("lastAccessBefore", filter.getLastAccessBefore());
        }
        if (filter.getLastAccessAfter() != null) {
            sql.append(" AND r.last_access >= :lastAccessAfter");
            parameters.addValue("lastAccessAfter", filter.getLastAccessAfter());
        }

        sql.append(" ORDER BY sub.end_date ASC NULLS LAST, r.name ASC");

        return jdbcTemplate.query(sql.toString(), parameters, this::mapSubscriptionCoverage);
    }

    private SubscriptionCoverageResponse mapSubscriptionCoverage(ResultSet rs, int rowNum) throws SQLException {
        return SubscriptionCoverageResponse.builder()
            .rosterId(rs.getLong("roster_id"))
            .rosterName(rs.getString("roster_name"))
            .rosterEmail(rs.getString("roster_email"))
            .rosterActive(rs.getObject("roster_active", Boolean.class))
            .creationDate(rs.getObject("creation_date", LocalDate.class))
            .lastAccess(rs.getObject("last_access", LocalDate.class))
            .clubId(rs.getObject("club_id", Long.class))
            .clubName(rs.getString("club_name"))
            .subscriptionId(rs.getObject("subscription_id", Long.class))
            .startDate(rs.getObject("start_date", LocalDate.class))
            .endDate(rs.getObject("end_date", LocalDate.class))
            .planId(rs.getObject("plan_id", Long.class))
            .planName(rs.getString("plan_name"))
            .planDescription(rs.getString("plan_description"))
            .planPrice(rs.getObject("plan_price", BigDecimal.class))
            .statusId(rs.getObject("status_id", Long.class))
            .statusName(rs.getString("status_name"))
            .daysRemaining(getAsInt(rs, "days_remaining"))
            .expired(rs.getObject("expired", Boolean.class))
            .benefitCount(getAsInt(rs, "benefit_count"))
            .build();
    }

    private Integer getAsInt(ResultSet rs, String column) throws SQLException {
        Number value = (Number) rs.getObject(column);
        return value != null ? value.intValue() : null;
    }
}
