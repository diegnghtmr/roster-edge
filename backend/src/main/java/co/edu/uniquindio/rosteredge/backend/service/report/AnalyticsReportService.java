package co.edu.uniquindio.rosteredge.backend.service.report;

import co.edu.uniquindio.rosteredge.backend.dto.filter.report.CategoryParticipationReportFilter;
import co.edu.uniquindio.rosteredge.backend.dto.filter.report.MatchLoadReportFilter;
import co.edu.uniquindio.rosteredge.backend.dto.filter.report.PointsProgressReportFilter;
import co.edu.uniquindio.rosteredge.backend.dto.filter.report.RosterProfileReportFilter;
import co.edu.uniquindio.rosteredge.backend.dto.filter.report.ScheduleDensityReportFilter;
import co.edu.uniquindio.rosteredge.backend.dto.filter.report.ScoringRankingReportFilter;
import co.edu.uniquindio.rosteredge.backend.dto.filter.report.SeasonAgendaReportFilter;
import co.edu.uniquindio.rosteredge.backend.dto.filter.report.SeasonStandingsReportFilter;
import co.edu.uniquindio.rosteredge.backend.dto.filter.report.StaffImpactReportFilter;
import co.edu.uniquindio.rosteredge.backend.dto.filter.report.StaffRatioReportFilter;
import co.edu.uniquindio.rosteredge.backend.dto.response.report.CategoryParticipationResponse;
import co.edu.uniquindio.rosteredge.backend.dto.response.report.ScheduleDensityResponse;
import co.edu.uniquindio.rosteredge.backend.dto.response.report.ScoringRankingResponse;
import co.edu.uniquindio.rosteredge.backend.dto.response.report.SeasonAgendaResponse;
import co.edu.uniquindio.rosteredge.backend.dto.response.report.SeasonStandingResponse;
import co.edu.uniquindio.rosteredge.backend.dto.response.report.StaffImpactResponse;
import co.edu.uniquindio.rosteredge.backend.dto.response.report.TeamMatchLoadResponse;
import co.edu.uniquindio.rosteredge.backend.dto.response.report.TeamPointsProgressResponse;
import co.edu.uniquindio.rosteredge.backend.dto.response.report.TeamRosterProfileResponse;
import co.edu.uniquindio.rosteredge.backend.dto.response.report.TeamStaffRatioResponse;
import java.util.List;

/**
 * Central service that exposes the backend analytics reports.
 */
public interface AnalyticsReportService {

    List<TeamRosterProfileResponse> getRosterProfiles(RosterProfileReportFilter filter);

    List<SeasonAgendaResponse> getSeasonAgenda(SeasonAgendaReportFilter filter);

    List<TeamMatchLoadResponse> getMatchLoad(MatchLoadReportFilter filter);

    List<ScoringRankingResponse> getScoringRanking(ScoringRankingReportFilter filter);

    List<TeamStaffRatioResponse> getStaffRatios(StaffRatioReportFilter filter);

    List<TeamPointsProgressResponse> getPointsProgress(PointsProgressReportFilter filter);

    List<CategoryParticipationResponse> getCategoryParticipation(CategoryParticipationReportFilter filter);

    List<SeasonStandingResponse> getSeasonStandings(SeasonStandingsReportFilter filter);

    List<ScheduleDensityResponse> getScheduleDensity(ScheduleDensityReportFilter filter);

    StaffImpactResponse getStaffImpact(StaffImpactReportFilter filter);
}
