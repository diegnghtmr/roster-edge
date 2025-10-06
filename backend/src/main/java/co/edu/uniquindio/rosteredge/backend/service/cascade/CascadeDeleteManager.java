package co.edu.uniquindio.rosteredge.backend.service.cascade;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * Executes the configured cascade rules before deleting parent entities.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class CascadeDeleteManager {

    private final CascadeDeleteRegistry registry;
    private final NamedParameterJdbcTemplate jdbcTemplate;

    /**
     * Clear every registered association that targets the provided table and identifier.
     *
     * @param tableName Table of the entity that is going to be deleted.
     * @param entityId  Identifier of the entity that will be removed.
     */
    public void clearAssociations(String tableName, Long entityId) {
        if (entityId == null) {
            return;
        }

        List<CascadeRule> rules = registry.getRulesFor(tableName);
        if (rules.isEmpty()) {
            log.debug("No cascade rules registered for table {}", tableName);
            return;
        }

        MapSqlParameterSource parameters = new MapSqlParameterSource("id", entityId);
        for (CascadeRule rule : rules) {
            switch (rule.getAction()) {
                case SET_NULL -> applySetNull(rule, parameters);
                case DELETE -> applyDelete(rule, parameters);
                default -> throw new IllegalStateException("Unhandled cascade action: " + rule.getAction());
            }
        }
    }

    private void applySetNull(CascadeRule rule, MapSqlParameterSource parameters) {
        String sql = String.format("UPDATE \"%s\" SET \"%s\" = NULL WHERE \"%s\" = :id",
                rule.getTable(), rule.getColumn(), rule.getColumn());
        log.debug("Applying SET_NULL cascade: {}", sql);
        jdbcTemplate.update(sql, parameters);
    }

    private void applyDelete(CascadeRule rule, MapSqlParameterSource parameters) {
        if (rule.isCascadeChildren()) {
            cascadeChildAssociations(rule, parameters);
        }
        String sql = String.format("DELETE FROM \"%s\" WHERE \"%s\" = :id",
                rule.getTable(), rule.getColumn());
        log.debug("Applying DELETE cascade: {}", sql);
        jdbcTemplate.update(sql, parameters);
    }

    private void cascadeChildAssociations(CascadeRule rule, MapSqlParameterSource parameters) {
        String selectSql = String.format("SELECT \"%s\" FROM \"%s\" WHERE \"%s\" = :id",
                rule.getIdColumn(), rule.getTable(), rule.getColumn());
        log.debug("Fetching child identifiers for recursive cascade: {}", selectSql);
        List<Long> childIds = jdbcTemplate.queryForList(selectSql, parameters, Long.class);
        for (Long childId : childIds) {
            if (childId != null) {
                clearAssociations(rule.getTable(), childId);
            }
        }
    }
}
