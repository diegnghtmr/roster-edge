package co.edu.uniquindio.rosteredge.backend.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

/** Both scores are required, including explicit zeroes for a scoreless draw. */
public record MatchResultRequest(
        @NotNull @PositiveOrZero Integer homeScore,
        @NotNull @PositiveOrZero Integer awayScore) {
}
