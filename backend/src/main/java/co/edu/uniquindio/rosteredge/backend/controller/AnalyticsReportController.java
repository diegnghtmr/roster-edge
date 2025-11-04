package co.edu.uniquindio.rosteredge.backend.controller;

import co.edu.uniquindio.rosteredge.backend.dto.ApiResponse;
import co.edu.uniquindio.rosteredge.backend.dto.filter.report.CategoryParticipationReportFilter;
import co.edu.uniquindio.rosteredge.backend.dto.filter.report.MatchLoadReportFilter;
import co.edu.uniquindio.rosteredge.backend.dto.filter.report.PaymentMethodReportFilter;
import co.edu.uniquindio.rosteredge.backend.dto.filter.report.PointsProgressReportFilter;
import co.edu.uniquindio.rosteredge.backend.dto.filter.report.RosterProfileReportFilter;
import co.edu.uniquindio.rosteredge.backend.dto.filter.report.ScheduleDensityReportFilter;
import co.edu.uniquindio.rosteredge.backend.dto.filter.report.ScoringRankingReportFilter;
import co.edu.uniquindio.rosteredge.backend.dto.filter.report.SeasonAgendaReportFilter;
import co.edu.uniquindio.rosteredge.backend.dto.filter.report.SeasonStandingsReportFilter;
import co.edu.uniquindio.rosteredge.backend.dto.filter.report.StaffImpactReportFilter;
import co.edu.uniquindio.rosteredge.backend.dto.filter.report.StaffRatioReportFilter;
import co.edu.uniquindio.rosteredge.backend.dto.filter.report.SubscriptionPlanReportFilter;
import co.edu.uniquindio.rosteredge.backend.dto.response.report.CategoryParticipationResponse;
import co.edu.uniquindio.rosteredge.backend.dto.response.report.PaymentMethodPerformanceResponse;
import co.edu.uniquindio.rosteredge.backend.dto.response.report.ScheduleDensityResponse;
import co.edu.uniquindio.rosteredge.backend.dto.response.report.ScoringRankingResponse;
import co.edu.uniquindio.rosteredge.backend.dto.response.report.SeasonAgendaResponse;
import co.edu.uniquindio.rosteredge.backend.dto.response.report.SeasonStandingResponse;
import co.edu.uniquindio.rosteredge.backend.dto.response.report.StaffImpactResponse;
import co.edu.uniquindio.rosteredge.backend.dto.response.report.SubscriptionPlanPerformanceResponse;
import co.edu.uniquindio.rosteredge.backend.dto.response.report.TeamMatchLoadResponse;
import co.edu.uniquindio.rosteredge.backend.dto.response.report.TeamPointsProgressResponse;
import co.edu.uniquindio.rosteredge.backend.dto.response.report.TeamRosterProfileResponse;
import co.edu.uniquindio.rosteredge.backend.dto.response.report.TeamStaffRatioResponse;
import co.edu.uniquindio.rosteredge.backend.service.report.AnalyticsReportService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Controller that exposes the analytics reports prepared for the frontends.
 */
@RestController
@RequestMapping("/analytics/reports")
@RequiredArgsConstructor
@Slf4j
public class AnalyticsReportController extends BaseController {

    private final AnalyticsReportService analyticsReportService;

    @GetMapping("/roster-profile/")
    public ResponseEntity<ApiResponse<List<TeamRosterProfileResponse>>> getRosterProfile(@ModelAttribute RosterProfileReportFilter filter) {
        log.info("Request analytics roster profile with filter: {}", filter);
        List<TeamRosterProfileResponse> data = analyticsReportService.getRosterProfiles(filter);
        return ResponseEntity.ok(ApiResponse.success(data));
    }

    @GetMapping("/season-agenda/")
    public ResponseEntity<ApiResponse<List<SeasonAgendaResponse>>> getSeasonAgenda(@ModelAttribute SeasonAgendaReportFilter filter) {
        log.info("Request analytics season agenda with filter: {}", filter);
        List<SeasonAgendaResponse> data = analyticsReportService.getSeasonAgenda(filter);
        return ResponseEntity.ok(ApiResponse.success(data));
    }

    @GetMapping("/match-load/")
    public ResponseEntity<ApiResponse<List<TeamMatchLoadResponse>>> getMatchLoad(@ModelAttribute MatchLoadReportFilter filter) {
        log.info("Request analytics match load with filter: {}", filter);
        List<TeamMatchLoadResponse> data = analyticsReportService.getMatchLoad(filter);
        return ResponseEntity.ok(ApiResponse.success(data));
    }

    @GetMapping("/scoring-ranking/")
    public ResponseEntity<ApiResponse<List<ScoringRankingResponse>>> getScoringRanking(@ModelAttribute ScoringRankingReportFilter filter) {
        log.info("Request analytics scoring ranking with filter: {}", filter);
        List<ScoringRankingResponse> data = analyticsReportService.getScoringRanking(filter);
        return ResponseEntity.ok(ApiResponse.success(data));
    }

    @GetMapping("/staff-ratio/")
    public ResponseEntity<ApiResponse<List<TeamStaffRatioResponse>>> getStaffRatio(@ModelAttribute StaffRatioReportFilter filter) {
        log.info("Request analytics staff ratio with filter: {}", filter);
        List<TeamStaffRatioResponse> data = analyticsReportService.getStaffRatios(filter);
        return ResponseEntity.ok(ApiResponse.success(data));
    }

    @GetMapping("/points-progress/")
    public ResponseEntity<ApiResponse<List<TeamPointsProgressResponse>>> getPointsProgress(@ModelAttribute PointsProgressReportFilter filter) {
        log.info("Request analytics points progress with filter: {}", filter);
        List<TeamPointsProgressResponse> data = analyticsReportService.getPointsProgress(filter);
        return ResponseEntity.ok(ApiResponse.success(data));
    }

    @GetMapping("/category-participation/")
    public ResponseEntity<ApiResponse<List<CategoryParticipationResponse>>> getCategoryParticipation(@ModelAttribute CategoryParticipationReportFilter filter) {
        log.info("Request analytics category participation with filter: {}", filter);
        List<CategoryParticipationResponse> data = analyticsReportService.getCategoryParticipation(filter);
        return ResponseEntity.ok(ApiResponse.success(data));
    }

    @GetMapping("/season-standings/")
    public ResponseEntity<ApiResponse<List<SeasonStandingResponse>>> getSeasonStandings(@ModelAttribute SeasonStandingsReportFilter filter) {
        log.info("Request analytics season standings with filter: {}", filter);
        List<SeasonStandingResponse> data = analyticsReportService.getSeasonStandings(filter);
        return ResponseEntity.ok(ApiResponse.success(data));
    }

    @GetMapping("/schedule-density/")
    public ResponseEntity<ApiResponse<List<ScheduleDensityResponse>>> getScheduleDensity(@ModelAttribute ScheduleDensityReportFilter filter) {
        log.info("Request analytics schedule density with filter: {}", filter);
        List<ScheduleDensityResponse> data = analyticsReportService.getScheduleDensity(filter);
        return ResponseEntity.ok(ApiResponse.success(data));
    }

    @GetMapping("/staff-impact/")
    public ResponseEntity<ApiResponse<StaffImpactResponse>> getStaffImpact(@ModelAttribute StaffImpactReportFilter filter) {
        log.info("Request analytics staff impact with filter: {}", filter);
        StaffImpactResponse data = analyticsReportService.getStaffImpact(filter);
        return ResponseEntity.ok(ApiResponse.success(data));
    }

    @GetMapping("/payment-method-performance/")
    public ResponseEntity<ApiResponse<List<PaymentMethodPerformanceResponse>>> getPaymentMethodPerformance(@ModelAttribute PaymentMethodReportFilter filter) {
        log.info("Request analytics payment method performance with filter: {}", filter);
        List<PaymentMethodPerformanceResponse> data = analyticsReportService.getPaymentMethodPerformance(filter);
        return ResponseEntity.ok(ApiResponse.success(data));
    }

    @GetMapping("/subscription-plan-performance/")
    public ResponseEntity<ApiResponse<List<SubscriptionPlanPerformanceResponse>>> getSubscriptionPlanPerformance(@ModelAttribute SubscriptionPlanReportFilter filter) {
        log.info("Request analytics subscription plan performance with filter: {}", filter);
        List<SubscriptionPlanPerformanceResponse> data = analyticsReportService.getSubscriptionPlanPerformance(filter);
        return ResponseEntity.ok(ApiResponse.success(data));
    }
}
