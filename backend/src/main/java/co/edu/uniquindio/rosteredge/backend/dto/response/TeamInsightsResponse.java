package co.edu.uniquindio.rosteredge.backend.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import java.time.LocalDate;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Projection used by the team insights endpoint.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class TeamInsightsResponse {

    private Long id;
    private String name;
    private String mascot;
    private LocalDate foundation;

    private Long clubId;
    private String clubName;

    private Long categoryId;
    private String categoryName;

    private Long genderId;
    private String genderName;

    private Integer totalPlayers;
    private Integer activePlayers;
    private Integer totalStaff;
    private Integer activeStreaks;

    private String colorPalette;

    private Boolean active;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
