package co.edu.uniquindio.rosteredge.backend.controller;

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
import co.edu.uniquindio.rosteredge.backend.service.report.AnalyticsReportPdf;
import co.edu.uniquindio.rosteredge.backend.service.report.AnalyticsReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.CacheControl;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value = "/analytics/reports", produces = MediaType.APPLICATION_PDF_VALUE)
@RequiredArgsConstructor
public class AnalyticsReportPdfController {

    private final AnalyticsReportService reports;
    private final AnalyticsReportPdf pdf;

    @GetMapping("/roster-profile/pdf/")
    public ResponseEntity<byte[]> rosterProfile(@ModelAttribute RosterProfileReportFilter filter) {
        return attachment("roster-profile", pdf.rosterProfile(reports.getRosterProfiles(filter)));
    }

    @GetMapping("/season-agenda/pdf/")
    public ResponseEntity<byte[]> seasonAgenda(@ModelAttribute SeasonAgendaReportFilter filter) {
        return attachment("season-agenda", pdf.seasonAgenda(reports.getSeasonAgenda(filter)));
    }

    @GetMapping("/match-load/pdf/")
    public ResponseEntity<byte[]> matchLoad(@ModelAttribute MatchLoadReportFilter filter) {
        return attachment("match-load", pdf.matchLoad(reports.getMatchLoad(filter)));
    }

    @GetMapping("/scoring-ranking/pdf/")
    public ResponseEntity<byte[]> scoringRanking(@ModelAttribute ScoringRankingReportFilter filter) {
        return attachment("scoring-ranking", pdf.scoringRanking(reports.getScoringRanking(filter)));
    }

    @GetMapping("/staff-ratio/pdf/")
    public ResponseEntity<byte[]> staffRatio(@ModelAttribute StaffRatioReportFilter filter) {
        return attachment("staff-ratio", pdf.staffRatio(reports.getStaffRatios(filter)));
    }

    @GetMapping("/points-progress/pdf/")
    public ResponseEntity<byte[]> pointsProgress(@ModelAttribute PointsProgressReportFilter filter) {
        return attachment("points-progress", pdf.pointsProgress(reports.getPointsProgress(filter)));
    }

    @GetMapping("/category-participation/pdf/")
    public ResponseEntity<byte[]> categoryParticipation(@ModelAttribute CategoryParticipationReportFilter filter) {
        return attachment("category-participation", pdf.categoryParticipation(reports.getCategoryParticipation(filter)));
    }

    @GetMapping("/season-standings/pdf/")
    public ResponseEntity<byte[]> seasonStandings(@ModelAttribute SeasonStandingsReportFilter filter) {
        return attachment("season-standings", pdf.seasonStandings(reports.getSeasonStandings(filter)));
    }

    @GetMapping("/schedule-density/pdf/")
    public ResponseEntity<byte[]> scheduleDensity(@ModelAttribute ScheduleDensityReportFilter filter) {
        return attachment("schedule-density", pdf.scheduleDensity(reports.getScheduleDensity(filter)));
    }

    @GetMapping("/staff-impact/pdf/")
    public ResponseEntity<byte[]> staffImpact(@ModelAttribute StaffImpactReportFilter filter) {
        return attachment("staff-impact", pdf.staffImpact(reports.getStaffImpact(filter)));
    }

    @GetMapping("/payment-method-performance/pdf/")
    public ResponseEntity<byte[]> paymentMethodPerformance(@ModelAttribute PaymentMethodReportFilter filter) {
        return attachment("payment-method-performance", pdf.paymentMethodPerformance(reports.getPaymentMethodPerformance(filter)));
    }

    @GetMapping("/subscription-plan-performance/pdf/")
    public ResponseEntity<byte[]> subscriptionPlanPerformance(@ModelAttribute SubscriptionPlanReportFilter filter) {
        return attachment("subscription-plan-performance", pdf.subscriptionPlanPerformance(reports.getSubscriptionPlanPerformance(filter)));
    }

    private static ResponseEntity<byte[]> attachment(String report, byte[] contents) {
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .cacheControl(CacheControl.noStore())
                .header(HttpHeaders.CONTENT_DISPOSITION, ContentDisposition.attachment().filename(report + ".pdf").build().toString())
                .body(contents);
    }
}
