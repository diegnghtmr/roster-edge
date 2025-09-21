package co.edu.uniquindio.rosteredge.backend.model;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.experimental.SuperBuilder;
import org.springframework.data.relational.core.mapping.Table;

/**
 * MatchAwayTeam entity
 * Represents away teams in matches
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@EqualsAndHashCode(callSuper = true)
@Table("MatchAwayTeam")
public class MatchAwayTeam extends BaseEntity {

    /**
     * Match ID
     */
    @NotNull(message = "Match ID is required")
    private Long matchId;

    /**
     * Team ID
     */
    @NotNull(message = "Team ID is required")
    private Long teamId;

    /**
     * Match score
     */
    @Min(value = 0, message = "Score cannot be negative")
    @lombok.Builder.Default
    private Integer score = 0;
}