package co.edu.uniquindio.rosteredge.backend.dto.filter.report;

import lombok.Data;

/**
 * Query parameters for the roster profile report.
 */
@Data
public class RosterProfileReportFilter {

    /**
     * Optional club identifier to limit the returned teams.
     */
    private Long clubId;

    /**
     * Optional team identifier to fetch a single roster profile.
     */
    private Long teamId;

    /**
     * When true, only active teams are included.
     */
    private Boolean onlyActiveTeams;

    /**
     * When true, only active players are counted.
     */
    private Boolean onlyActivePlayers;
}
