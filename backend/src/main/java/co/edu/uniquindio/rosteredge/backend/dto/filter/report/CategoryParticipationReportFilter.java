package co.edu.uniquindio.rosteredge.backend.dto.filter.report;

import lombok.Data;

/**
 * Filters for the club participation by category/gender report.
 */
@Data
public class CategoryParticipationReportFilter {

    private Long clubId;
    private Long seasonId;
    private Long categoryId;
    private Long genderId;
}
