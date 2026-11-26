package co.edu.uniquindio.rosteredge.backend.dto.response;

import co.edu.uniquindio.rosteredge.backend.model.Roster;

import java.time.LocalDate;
import java.time.LocalDateTime;

public record RosterSummaryResponse(Long id, String name, String email, Long clubId, Long subscriptionId,
                                    Boolean active, LocalDate creationDate, LocalDate lastAccess,
                                    LocalDateTime createdAt, LocalDateTime updatedAt) {
    public static RosterSummaryResponse from(Roster roster) {
        return new RosterSummaryResponse(roster.getId(), roster.getName(), roster.getEmail(), roster.getClubId(),
                roster.getSubscriptionId(), roster.getActive(), roster.getCreationDate(), roster.getLastAccess(),
                roster.getCreatedAt(), roster.getUpdatedAt());
    }
}
