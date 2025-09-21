package co.edu.uniquindio.rosteredge.backend.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

/**
 * Response DTO for Match entity
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class MatchResponse {

    private Long id;

    private Long matchdayId;

    private String matchdayName;

    private LocalTime startTime;

    private LocalTime endTime;

    private LocalDate date;

    private Long stadiumId;

    private String stadiumName;

    private Long seasonId;

    private String seasonName;

    private Boolean active;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}
