package co.edu.uniquindio.rosteredge.backend.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Enriched response DTO for Notification entity with club and event information
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class NotificationResponse {

    private Long id;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Boolean active;
    private String message;
    private LocalDateTime sendDate;

    // Related clubs and events information
    private List<RelatedClubEvent> relatedClubEvents;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class RelatedClubEvent {

        private Long clubId;
        private String clubName;
        private Long eventId;
        private String eventName;
        private LocalDate eventDate;
    }
}
