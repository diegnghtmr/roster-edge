package co.edu.uniquindio.rosteredge.backend.service.report;

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
import com.lowagie.text.pdf.PdfReader;
import com.lowagie.text.pdf.parser.PdfTextExtractor;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;

import java.io.IOException;
import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.util.List;
import java.util.function.Function;
import java.util.regex.Pattern;
import java.util.stream.IntStream;
import java.util.stream.Stream;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.within;

class AnalyticsReportPdfTest {
    // Tables fill rectangles but never fill AND stroke them. Count chart bars, not table cells.
    private static final Pattern BAR = Pattern.compile("(?:[-\\d.]+\\s+){3}([-\\d.]+)\\s+re\\s+B\\b");
    private static final Pattern CURVE = Pattern.compile("(?:[-\\d.]+\\s+){6}c\\b");
    private static final Pattern PIE_SLICE = Pattern.compile(CURVE.pattern() + "\\s+h\\s+B\\b");
    private static final Pattern SERIES_SEGMENT = Pattern.compile("2\\.5 w\\s+(?:[-\\d.]+\\s+){2}m\\s+(?:[-\\d.]+\\s+){2}l\\s+S\\b");
    private final AnalyticsReportPdf reports = new AnalyticsReportPdf();

    @Test
    void standingsDrawsTopTenBarsScaledToPointsAndKeepsAllTeamsInTheTable() throws IOException {
        var teams = IntStream.rangeClosed(1, 11).mapToObj(i -> SeasonStandingResponse.builder()
                .teamName(i == 1 ? "Deportivo Quindío" : "Equipo " + i).rankingPosition(i)
                .points(22 - i * 2).build()).toList();
        var report = read(reports.seasonStandings(teams));

        var heights = BAR.matcher(report.operators()).results().map(m -> Float.parseFloat(m.group(1))).toList();
        assertThat(heights).hasSize(10);
        assertThat(heights.get(1) / heights.getFirst()).isCloseTo(0.9f, within(0.001f));
        assertThat(report.text().replaceAll("\\s+", " ")).containsSubsequence("Distribución de Puntos (Top 10)",
                "Deportivo ...", "Clasificación Completa", "Deportivo Quindío", "Equipo 11");
    }

    @Test
    void emptyStandingsKeepsTheTableEmptyStateWithoutBars() throws IOException {
        assertEmpty(reports.seasonStandings(List.of()), "Distribución de Puntos (Top 10)", "Clasificación Completa");
    }

    @Test
    void scheduleDensityDrawsMarkersForAllThreeSeriesAndKeepsTheDetailTable() throws IOException {
        var matches = List.of(
                ScheduleDensityResponse.builder().matchDate(LocalDate.of(2025, 9, 1)).restDays(6)
                        .matchesLastSevenDays(2).matchesNextSevenDays(3).matchDurationMinutes(90).build(),
                ScheduleDensityResponse.builder().restDays(2).matchesLastSevenDays(4)
                        .matchesNextSevenDays(1).matchDurationMinutes(85).belowRestThreshold(true).build());
        var report = read(reports.scheduleDensity(matches));

        assertThat(count(SERIES_SEGMENT, report)).isEqualTo(3);
        assertThat(count(CURVE, report)).isEqualTo(24); // Four cubic curves per marker; two dates, three series.
        assertThat(report.text()).containsSubsequence("Evolución del Descanso y Densidad",
                "Días de Descanso", "Últimos 7d", "Próximos 7d", "P2",
                "Detalle Completo", "Duración (min)", "2025-09-01", "90", "85", "Sí");
    }

    @Test
    void emptyScheduleDensityKeepsTheTableEmptyStateWithoutMarkers() throws IOException {
        assertEmpty(reports.scheduleDensity(List.of()), "Evolución del Descanso y Densidad", "Detalle Completo");
    }

    @ParameterizedTest(name = "{0}")
    @MethodSource("otherCharts")
    void otherLegacyChartsKeepTheirVectorSeriesAndTable(String title, ChartCase chart) throws IOException {
        var report = read(chart.populated().apply(reports));
        assertThat(count(chart.shape(), report)).isEqualTo(chart.shapes());
        assertThat(report.text()).containsSubsequence(title, chart.chartLabel(), chart.detailLabel());
    }

    @ParameterizedTest(name = "{0}")
    @MethodSource("otherCharts")
    void otherLegacyChartsDoNotDrawEmptyPlots(String title, ChartCase chart) throws IOException {
        var report = read(chart.empty().apply(reports));
        assertThat(count(BAR, report)).isZero();
        assertThat(count(CURVE, report)).isZero();
        assertThat(report.text()).contains("Sin datos");
    }

    private static Stream<Arguments> otherCharts() {
        return Stream.of(
                bars("Jugadores por Equipo (Top 10)", reports -> reports.rosterProfile(List.of(
                                TeamRosterProfileResponse.builder().teamName("Club Norte").totalPlayers(15).build())),
                        reports -> reports.rosterProfile(List.of()), 1, "Club Norte", "Total de Jugadores"),
                bars("Distribución por Estado Físico", reports -> reports.rosterProfile(List.of(
                                TeamRosterProfileResponse.builder().teamName("Club Norte").totalPlayers(15).physicalStates(List.of(
                                        TeamRosterProfileResponse.PhysicalStateBreakdown.builder().physicalStateName("Activo").players(12).build(),
                                        TeamRosterProfileResponse.PhysicalStateBreakdown.builder().physicalStateName("Lesión").players(3).build())).build())),
                        reports -> reports.rosterProfile(List.of()), 3, "Lesión", "Estado Físico"),
                bars("Distribución de Eventos", reports -> reports.seasonAgenda(List.of(
                                SeasonAgendaResponse.builder().eventName("Copa").daysToEvent(3L).build())),
                        reports -> reports.seasonAgenda(List.of()), 2, "Próximos", "Calendario Completo"),
                bars("Carga de Partidos por Equipo (Top 10)", reports -> reports.matchLoad(List.of(
                                TeamMatchLoadResponse.builder().teamName("Club Norte").totalMatches(8).build())),
                        reports -> reports.matchLoad(List.of()), 1, "Club Norte", "Detalle Completo"),
                bars("Top 10 Equipos Goleadores", reports -> reports.scoringRanking(List.of(
                                ScoringRankingResponse.builder().teamName("Club Norte").goalsFor(9).build())),
                        reports -> reports.scoringRanking(List.of()), 1, "Club Norte", "Estadísticas Completas"),
                bars("Personal vs Jugadores (Top 10)", reports -> reports.staffRatio(List.of(
                                TeamStaffRatioResponse.builder().teamName("Club Norte").staff(4).players(15).build())),
                        reports -> reports.staffRatio(List.of()), 2, "Jugadores", "Detalle Completo"),
                chart("Distribución por Rol", reports -> reports.staffRatio(List.of(
                                TeamStaffRatioResponse.builder().teamName("Club Norte").staff(4).players(15).roleBreakdown(List.of(
                                        TeamStaffRatioResponse.StaffRoleBreakdown.builder().roleName("Técnico").staffCount(1).build(),
                                        TeamStaffRatioResponse.StaffRoleBreakdown.builder().roleName("Asistentes").staffCount(3).build())).build())),
                        reports -> reports.staffRatio(List.of()), PIE_SLICE, 2, "Técnico: 25.0%", "Detalle Completo"),
                chart("Evolución de Puntos Acumulados", reports -> reports.pointsProgress(List.of(
                                TeamPointsProgressResponse.builder().matchNumber(1).cumulativePoints(3).build(),
                                TeamPointsProgressResponse.builder().matchNumber(2).cumulativePoints(4).build())),
                        reports -> reports.pointsProgress(List.of()), CURVE, 8, "Jornadas", "Detalle por Jornada"),
                bars("Partidos por Categoría", AnalyticsReportPdfTest::participation,
                        reports -> reports.categoryParticipation(List.of()), 2, "Juvenil", "Detalle Completo"),
                chart("Distribución por Género", AnalyticsReportPdfTest::participation,
                        reports -> reports.categoryParticipation(List.of()), PIE_SLICE, 2, "Femenino: 25.0%", "Detalle Completo"),
                bars("Ratio Staff vs % Victorias (Top 10)", reports -> reports.staffImpact(StaffImpactResponse.builder()
                                .teamDetails(List.of(StaffImpactResponse.TeamStaffImpactDetail.builder().teamName("Club Norte")
                                        .staffToPlayerRatio(0.2).winRate(0.5).build())).build()),
                        reports -> reports.staffImpact(new StaffImpactResponse()), 2, "Ratio Staff/Jugador", "Detalle Completo"),
                bars("Ingresos netos por metodo", AnalyticsReportPdfTest::paymentPerformance,
                        reports -> reports.paymentMethodPerformance(List.of()), 2, "Efectivo", "Detalle completo"),
                chart("Participacion en ingresos", AnalyticsReportPdfTest::paymentPerformance,
                        reports -> reports.paymentMethodPerformance(List.of()), PIE_SLICE, 2, "Efectivo: 25.0%", "Detalle completo"),
                bars("Ingresos por plan", AnalyticsReportPdfTest::planPerformance,
                        reports -> reports.subscriptionPlanPerformance(List.of()), 1, "Mensual", "Detalle completo"),
                chart("Distribucion de estados", AnalyticsReportPdfTest::planPerformance,
                        reports -> reports.subscriptionPlanPerformance(List.of()), PIE_SLICE, 2, "Activas: 75.0%", "Detalle completo"));
    }

    private static byte[] participation(AnalyticsReportPdf reports) {
        return reports.categoryParticipation(List.of(
                CategoryParticipationResponse.builder().categoryName("Juvenil").genderName("Femenino").matchesCount(2).build(),
                CategoryParticipationResponse.builder().categoryName("Infantil").genderName("Masculino").matchesCount(6).build()));
    }

    private static byte[] paymentPerformance(AnalyticsReportPdf reports) {
        return reports.paymentMethodPerformance(List.of(
                PaymentMethodPerformanceResponse.builder().paymentMethodName("Efectivo")
                        .netRevenue(BigDecimal.valueOf(2500)).revenueSharePercentage(25.0).build(),
                PaymentMethodPerformanceResponse.builder().paymentMethodName("Tarjeta")
                        .netRevenue(BigDecimal.valueOf(7500)).revenueSharePercentage(75.0).build()));
    }

    private static byte[] planPerformance(AnalyticsReportPdf reports) {
        return reports.subscriptionPlanPerformance(List.of(SubscriptionPlanPerformanceResponse.builder().planName("Mensual")
                .netRevenue(BigDecimal.valueOf(8000)).activeSubscriptions(3).trialSubscriptions(1).build()));
    }

    private static Arguments bars(String title, Function<AnalyticsReportPdf, byte[]> populated,
                                  Function<AnalyticsReportPdf, byte[]> empty, long shapes, String label, String detail) {
        return chart(title, populated, empty, BAR, shapes, label, detail);
    }

    private static Arguments chart(String title, Function<AnalyticsReportPdf, byte[]> populated,
                                   Function<AnalyticsReportPdf, byte[]> empty, Pattern shape, long shapes,
                                   String label, String detail) {
        return Arguments.of(title, new ChartCase(populated, empty, shape, shapes, label, detail));
    }

    private static void assertEmpty(byte[] bytes, String chartTitle, String detailTitle) throws IOException {
        var report = read(bytes);
        assertThat(count(BAR, report)).isZero();
        assertThat(count(CURVE, report)).isZero();
        assertThat(report.text()).containsSubsequence(chartTitle, "Sin datos", detailTitle, "Sin datos");
    }

    private static long count(Pattern operator, RenderedPdf report) {
        return operator.matcher(report.operators()).results().count();
    }

    private static RenderedPdf read(byte[] bytes) throws IOException {
        var pdf = new PdfReader(bytes);
        try {
            var text = new StringBuilder();
            var operators = new StringBuilder();
            var extractor = new PdfTextExtractor(pdf);
            for (int page = 1; page <= pdf.getNumberOfPages(); page++) {
                text.append(extractor.getTextFromPage(page)).append('\n');
                operators.append(new String(pdf.getPageContent(page), StandardCharsets.ISO_8859_1)).append('\n');
            }
            return new RenderedPdf(text.toString(), operators.toString());
        } finally {
            pdf.close();
        }
    }

    private record RenderedPdf(String text, String operators) { }

    private record ChartCase(Function<AnalyticsReportPdf, byte[]> populated, Function<AnalyticsReportPdf, byte[]> empty,
                             Pattern shape, long shapes, String chartLabel, String detailLabel) { }
}
