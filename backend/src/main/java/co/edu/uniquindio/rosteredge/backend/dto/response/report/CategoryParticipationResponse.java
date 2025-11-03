package co.edu.uniquindio.rosteredge.backend.dto.response.report;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Result record for the participation by category and gender report.
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class CategoryParticipationResponse {

    private Long clubId;
    private String clubName;
    private Long seasonId;
    private String seasonName;

    private Long categoryId;
    private String categoryName;
    private Long genderId;
    private String genderName;

    private Integer matchesCount;
    private Double participationPercentage;
}
