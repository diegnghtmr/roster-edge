package co.edu.uniquindio.rosteredge.backend.service.impl.report;

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
import co.edu.uniquindio.rosteredge.backend.dto.response.report.StaffImpactResponse.TeamStaffImpactDetail;
import co.edu.uniquindio.rosteredge.backend.dto.response.report.TeamMatchLoadResponse;
import co.edu.uniquindio.rosteredge.backend.dto.response.report.TeamPointsProgressResponse;
import co.edu.uniquindio.rosteredge.backend.dto.response.report.TeamRosterProfileResponse;
import co.edu.uniquindio.rosteredge.backend.dto.response.report.TeamStaffRatioResponse;
import co.edu.uniquindio.rosteredge.backend.repository.report.AnalyticsReportQueryRepository;
import co.edu.uniquindio.rosteredge.backend.service.report.AnalyticsReportService;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.DoubleSummaryStatistics;
import java.util.List;
import java.util.Objects;
import java.util.function.Function;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

/**
 * Default implementation of the analytics report service.
 */
@Service
@RequiredArgsConstructor
public class AnalyticsReportServiceImpl implements AnalyticsReportService {

    private static final int DEFAULT_AGENDA_HORIZON_DAYS = 30;
    private static final int DEFAULT_REST_THRESHOLD = 3;

    private final AnalyticsReportQueryRepository reportQueryRepository;

    @Override
    public List<TeamRosterProfileResponse> getRosterProfiles(RosterProfileReportFilter filter) {
        RosterProfileReportFilter effective = filter != null ? filter : new RosterProfileReportFilter();
        if (effective.getOnlyActiveTeams() == null) {
            effective.setOnlyActiveTeams(Boolean.TRUE);
        }
        if (effective.getOnlyActivePlayers() == null) {
            effective.setOnlyActivePlayers(Boolean.TRUE);
        }
        List<TeamRosterProfileResponse> responses = reportQueryRepository.findTeamRosters(effective);
        responses.forEach(response -> {
            if (!CollectionUtils.isEmpty(response.getPhysicalStates())) {
                response.setPhysicalStates(response.getPhysicalStates().stream()
                    .sorted(Comparator.comparing(TeamRosterProfileResponse.PhysicalStateBreakdown::getPlayers, Comparator.nullsLast(Comparator.reverseOrder())))
                    .collect(Collectors.toList()));
            }
        });
        return responses;
    }

    @Override
    public List<SeasonAgendaResponse> getSeasonAgenda(SeasonAgendaReportFilter filter) {
        SeasonAgendaReportFilter effective = filter != null ? filter : new SeasonAgendaReportFilter();
        if (effective.getFromDate() == null && effective.getToDate() == null && effective.getHorizonDays() == null) {
            effective.setHorizonDays(DEFAULT_AGENDA_HORIZON_DAYS);
        }
        List<SeasonAgendaResponse> agenda = reportQueryRepository.findSeasonAgenda(effective);
        // Ensure events are returned in chronological order
        agenda.sort(Comparator.comparing(SeasonAgendaResponse::getEventDate, Comparator.nullsLast(Comparator.naturalOrder()))
            .thenComparing(SeasonAgendaResponse::getEventId, Comparator.nullsLast(Comparator.naturalOrder())));
        return agenda;
    }

    @Override
    public List<TeamMatchLoadResponse> getMatchLoad(MatchLoadReportFilter filter) {
        MatchLoadReportFilter effective = filter != null ? filter : new MatchLoadReportFilter();
        return reportQueryRepository.findMatchLoad(effective);
    }

    @Override
    public List<ScoringRankingResponse> getScoringRanking(ScoringRankingReportFilter filter) {
        ScoringRankingReportFilter effective = filter != null ? filter : new ScoringRankingReportFilter();
        List<ScoringRankingResponse> ranking = reportQueryRepository.findScoringRanking(effective);
        ranking.sort(Comparator
            .comparing(ScoringRankingResponse::getSeasonId, Comparator.nullsFirst(Comparator.naturalOrder()))
            .thenComparing(ScoringRankingResponse::getGoalDifference, Comparator.nullsLast(Comparator.reverseOrder()))
            .thenComparing(ScoringRankingResponse::getGoalsFor, Comparator.nullsLast(Comparator.reverseOrder())));
        return ranking;
    }

    @Override
    public List<TeamStaffRatioResponse> getStaffRatios(StaffRatioReportFilter filter) {
        StaffRatioReportFilter effective = filter != null ? filter : new StaffRatioReportFilter();
        List<TeamStaffRatioResponse> ratios = reportQueryRepository.findStaffRatios(effective);
        ratios.forEach(response -> {
            if (!CollectionUtils.isEmpty(response.getRoleBreakdown())) {
                response.setRoleBreakdown(response.getRoleBreakdown().stream()
                    .sorted(Comparator.comparing(TeamStaffRatioResponse.StaffRoleBreakdown::getStaffCount, Comparator.nullsLast(Comparator.reverseOrder())))
                    .collect(Collectors.toList()));
            }
        });
        ratios.sort(Comparator.comparing(TeamStaffRatioResponse::getTeamName, Comparator.nullsLast(Comparator.naturalOrder())));
        return ratios;
    }

    @Override
    public List<TeamPointsProgressResponse> getPointsProgress(PointsProgressReportFilter filter) {
        PointsProgressReportFilter effective = filter != null ? filter : new PointsProgressReportFilter();
        List<TeamPointsProgressResponse> progress = reportQueryRepository.findPointsProgress(effective);
        progress.sort(Comparator
            .comparing(TeamPointsProgressResponse::getSeasonId, Comparator.nullsFirst(Comparator.naturalOrder()))
            .thenComparing(TeamPointsProgressResponse::getTeamId, Comparator.nullsFirst(Comparator.naturalOrder()))
            .thenComparing(TeamPointsProgressResponse::getMatchNumber, Comparator.nullsFirst(Comparator.naturalOrder())));
        return progress;
    }

    @Override
    public List<CategoryParticipationResponse> getCategoryParticipation(CategoryParticipationReportFilter filter) {
        CategoryParticipationReportFilter effective = filter != null ? filter : new CategoryParticipationReportFilter();
        List<CategoryParticipationResponse> responses = reportQueryRepository.findCategoryParticipation(effective);
        responses.sort(Comparator
            .comparing(CategoryParticipationResponse::getClubId, Comparator.nullsFirst(Comparator.naturalOrder()))
            .thenComparing(CategoryParticipationResponse::getSeasonId, Comparator.nullsFirst(Comparator.naturalOrder()))
            .thenComparing(CategoryParticipationResponse::getMatchesCount, Comparator.nullsLast(Comparator.reverseOrder())));
        return responses;
    }

    @Override
    public List<SeasonStandingResponse> getSeasonStandings(SeasonStandingsReportFilter filter) {
        SeasonStandingsReportFilter effective = filter != null ? filter : new SeasonStandingsReportFilter();
        List<SeasonStandingResponse> standings = reportQueryRepository.findSeasonStandings(effective);
        standings.sort(Comparator
            .comparing(SeasonStandingResponse::getSeasonId, Comparator.nullsFirst(Comparator.naturalOrder()))
            .thenComparing(SeasonStandingResponse::getRankingPosition, Comparator.nullsFirst(Comparator.naturalOrder())));
        return standings;
    }

    @Override
    public List<ScheduleDensityResponse> getScheduleDensity(ScheduleDensityReportFilter filter) {
        ScheduleDensityReportFilter effective = filter != null ? filter : new ScheduleDensityReportFilter();
        if (effective.getAlertThresholdDays() == null) {
            effective.setAlertThresholdDays(DEFAULT_REST_THRESHOLD);
        }
        List<ScheduleDensityResponse> density = reportQueryRepository.findScheduleDensity(effective);
        density.sort(Comparator
            .comparing(ScheduleDensityResponse::getTeamId, Comparator.nullsFirst(Comparator.naturalOrder()))
            .thenComparing(ScheduleDensityResponse::getMatchDate, Comparator.nullsFirst(Comparator.naturalOrder())));
        return density;
    }

    @Override
    public StaffImpactResponse getStaffImpact(StaffImpactReportFilter filter) {
        StaffImpactReportFilter effective = filter != null ? filter : new StaffImpactReportFilter();
        List<TeamStaffImpactDetail> details = reportQueryRepository.findStaffImpactDetails(effective);

        Double ratioWinRateCorrelation = computeCorrelation(details,
            TeamStaffImpactDetail::getStaffToPlayerRatio,
            TeamStaffImpactDetail::getWinRate);

        Double ratioPointsCorrelation = computeCorrelation(details,
            TeamStaffImpactDetail::getStaffToPlayerRatio,
            TeamStaffImpactDetail::getPointsPerMatch);

        Double averageRatio = computeAverage(details, TeamStaffImpactDetail::getStaffToPlayerRatio);
        Double averageAge = computeAverage(details, TeamStaffImpactDetail::getAveragePlayerAge);

        List<TeamStaffImpactDetail> orderedDetails = new ArrayList<>(details);
        orderedDetails.sort(Comparator
            .comparing(TeamStaffImpactDetail::getSeasonId, Comparator.nullsFirst(Comparator.naturalOrder()))
            .thenComparing(TeamStaffImpactDetail::getStaffToPlayerRatio, Comparator.nullsLast(Comparator.reverseOrder())));

        return StaffImpactResponse.builder()
            .ratioWinRateCorrelation(ratioWinRateCorrelation)
            .ratioPointsCorrelation(ratioPointsCorrelation)
            .averageStaffRatio(averageRatio)
            .averagePlayerAge(averageAge)
            .teamDetails(orderedDetails)
            .build();
    }

    private Double computeAverage(List<TeamStaffImpactDetail> details, Function<TeamStaffImpactDetail, Double> extractor) {
        DoubleSummaryStatistics stats = details.stream()
            .map(extractor)
            .filter(Objects::nonNull)
            .mapToDouble(Double::doubleValue)
            .summaryStatistics();
        if (stats.getCount() == 0) {
            return null;
        }
        return stats.getAverage();
    }

    private Double computeCorrelation(List<TeamStaffImpactDetail> details,
                                      Function<TeamStaffImpactDetail, Double> xExtractor,
                                      Function<TeamStaffImpactDetail, Double> yExtractor) {
        List<Double> xValues = details.stream()
            .map(xExtractor)
            .collect(Collectors.toList());
        List<Double> yValues = details.stream()
            .map(yExtractor)
            .collect(Collectors.toList());

        List<Double> filteredX = new ArrayList<>();
        List<Double> filteredY = new ArrayList<>();
        for (int i = 0; i < xValues.size(); i++) {
            Double x = xValues.get(i);
            Double y = yValues.get(i);
            if (x != null && y != null) {
                filteredX.add(x);
                filteredY.add(y);
            }
        }
        int n = filteredX.size();
        if (n < 2) {
            return null;
        }

        double meanX = filteredX.stream().mapToDouble(Double::doubleValue).average().orElse(0d);
        double meanY = filteredY.stream().mapToDouble(Double::doubleValue).average().orElse(0d);

        double covariance = 0d;
        double varianceX = 0d;
        double varianceY = 0d;
        for (int i = 0; i < n; i++) {
            double dx = filteredX.get(i) - meanX;
            double dy = filteredY.get(i) - meanY;
            covariance += dx * dy;
            varianceX += dx * dx;
            varianceY += dy * dy;
        }

        if (varianceX == 0 || varianceY == 0) {
            return null;
        }

        double denominator = Math.sqrt(varianceX * varianceY);
        if (denominator == 0) {
            return null;
        }
        return covariance / denominator;
    }
}
