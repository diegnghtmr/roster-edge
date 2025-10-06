package co.edu.uniquindio.rosteredge.backend.service.cascade;

import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.List;
import java.util.Map;

import static co.edu.uniquindio.rosteredge.backend.service.cascade.CascadeAction.DELETE;
import static co.edu.uniquindio.rosteredge.backend.service.cascade.CascadeAction.SET_NULL;

/**
 * Registry that maps each parent table to the actions required to clear its child associations.
 */
@Component
public class CascadeDeleteRegistry {

    private final Map<String, List<CascadeRule>> rulesByTable;

    public CascadeDeleteRegistry() {
        this.rulesByTable = Collections.unmodifiableMap(Map.ofEntries(
                Map.entry("Country", List.of(
                        rule("City", "country_id", SET_NULL)
                )),
                Map.entry("City", List.of(
                        rule("User", "city_id", SET_NULL),
                        rule("Venue", "city_id", SET_NULL)
                )),
                Map.entry("Club", List.of(
                        rule("Season", "club_id", SET_NULL),
                        rule("Team", "club_id", SET_NULL),
                        rule("Venue", "club_id", SET_NULL),
                        rule("Roster", "club_id", SET_NULL),
                        deleteWithChildren("ClubEvent", "club_id")
                )),
                Map.entry("TeamCategory", List.of(
                        rule("Team", "category_id", SET_NULL)
                )),
                Map.entry("TeamGender", List.of(
                        rule("Team", "gender_id", SET_NULL)
                )),
                Map.entry("Venue", List.of(
                        rule("Stadium", "venue_id", SET_NULL),
                        rule("Event", "venue_id", SET_NULL)
                )),
                Map.entry("Stadium", List.of(
                        rule("Match", "stadium_id", SET_NULL)
                )),
                Map.entry("Team", List.of(
                        rule("Player", "team_id", SET_NULL),
                        rule("Staff", "team_id", SET_NULL),
                        rule("MatchHomeTeam", "team_id", DELETE),
                        rule("MatchAwayTeam", "team_id", DELETE),
                        rule("Streak", "team_id", SET_NULL),
                        rule("TeamColor", "team_id", DELETE)
                )),
                Map.entry("Season", List.of(
                        rule("Event", "season_id", SET_NULL),
                        rule("Match", "season_id", SET_NULL)
                )),
                Map.entry("Match", List.of(
                        rule("MatchHomeTeam", "match_id", DELETE),
                        rule("MatchAwayTeam", "match_id", DELETE)
                )),
                Map.entry("PlayerPosition", List.of(
                        rule("Player", "primary_position_id", SET_NULL)
                )),
                Map.entry("PhysicalState", List.of(
                        rule("Player", "physical_state_id", SET_NULL)
                )),
                Map.entry("StaffRole", List.of(
                        rule("Staff", "staff_role_id", SET_NULL)
                )),
                Map.entry("Roster", List.of(
                        rule("RosterDocumentTemplate", "roster_id", DELETE)
                )),
                Map.entry("DocumentTemplate", List.of(
                        rule("RosterDocumentTemplate", "document_template_id", DELETE)
                )),
                Map.entry("DocumentType", List.of(
                        rule("DocumentTemplate", "document_type_id", SET_NULL)
                )),
                Map.entry("DocumentFormat", List.of(
                        rule("DocumentTemplate", "document_format_id", SET_NULL)
                )),
                Map.entry("Subscription", List.of(
                        rule("Roster", "subscription_id", SET_NULL)
                )),
                Map.entry("Plan", List.of(
                        rule("Subscription", "plan_id", SET_NULL),
                        rule("PlanBenefit", "plan_id", SET_NULL),
                        rule("Payment", "plan_id", SET_NULL)
                )),
                Map.entry("PaymentMethod", List.of(
                        rule("Payment", "payment_method_id", SET_NULL)
                )),
                Map.entry("Currency", List.of(
                        rule("Payment", "currency_id", SET_NULL)
                )),
                Map.entry("SubscriptionStatus", List.of(
                        rule("Subscription", "status_id", SET_NULL)
                )),
                Map.entry("Event", List.of(
                        deleteWithChildren("ClubEvent", "event_id")
                )),
                Map.entry("ClubEvent", List.of(
                        rule("NotificationClubEvent", "club_event_id", DELETE)
                )),
                Map.entry("Notification", List.of(
                        rule("NotificationClubEvent", "notification_id", DELETE)
                )),
                Map.entry("Matchday", List.of(
                        rule("Match", "matchday_id", SET_NULL)
                )),
                Map.entry("Color", List.of(
                        rule("TeamColor", "color_id", DELETE)
                ))
        ));
    }

    public List<CascadeRule> getRulesFor(String tableName) {
        return rulesByTable.getOrDefault(tableName, List.of());
    }

    private static CascadeRule rule(String table, String column, CascadeAction action) {
        return CascadeRule.builder()
                .table(table)
                .column(column)
                .action(action)
                .build();
    }

    private static CascadeRule deleteWithChildren(String table, String column) {
        return CascadeRule.builder()
                .table(table)
                .column(column)
                .action(DELETE)
                .cascadeChildren(true)
                .build();
    }
}
