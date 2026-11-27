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
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.text.NumberFormat;
import java.time.format.DateTimeFormatter;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.function.Function;

import static co.edu.uniquindio.rosteredge.backend.service.report.ReportPdfLayout.columns;
import static co.edu.uniquindio.rosteredge.backend.service.report.ReportPdfLayout.row;

/** Renders the existing report DTOs; it never fetches or accepts user-supplied report rows. */
@Component
public class AnalyticsReportPdf {
    private static final DateTimeFormatter PAYMENT_DATE = DateTimeFormatter.ofPattern("d/M/uuuu");

    public byte[] rosterProfile(List<TeamRosterProfileResponse> teams) {
        var states = new LinkedHashMap<String, Long>();
        teams.forEach(team -> list(team.getPhysicalStates()).forEach(state ->
                states.merge(label(state.getPhysicalStateName(), "Desconocido"), n(state.getPlayers()), Long::sum)));
        return ReportPdfLayout.render("Perfil de Plantilla", "Análisis detallado de jugadores por equipo", pdf -> {
            pdf.summary(row("Total de Jugadores", sum(teams, TeamRosterProfileResponse::getTotalPlayers)),
                    row("Jugadores Activos", sum(teams, TeamRosterProfileResponse::getActivePlayers)),
                    row("Edad Promedio", (teams.isEmpty() ? "0" : fixed(avg(teams, TeamRosterProfileResponse::getAverageAge), 1)) + " años"));
            pdf.table("Jugadores por Equipo (Top 10)", columns("Equipo", "Jugadores"), teams.stream().limit(10)
                    .map(t -> row(t.getTeamName(), n(t.getTotalPlayers()))).toList());
            if (!states.isEmpty()) {
                pdf.table("Distribución por Estado Físico", columns("Estado", "Jugadores"), aggregateRows(states, 10));
            }
            for (var team : teams) {
                pdf.table(label(team.getTeamName(), "-") + " - " + label(team.getClubName(), "-"), columns("Indicador", "Valor"), List.of(
                        row("Total de Jugadores", n(team.getTotalPlayers())), row("Jugadores Activos", n(team.getActivePlayers())),
                        row("Edad Promedio", optional(team.getAverageAge(), 1, "-", " años"))));
                if (!list(team.getPhysicalStates()).isEmpty()) {
                    pdf.table("Estado Físico", columns("Estado", "Jugadores"), team.getPhysicalStates().stream()
                            .map(s -> row(s.getPhysicalStateName(), n(s.getPlayers()))).toList());
                }
            }
        });
    }

    public byte[] seasonAgenda(List<SeasonAgendaResponse> events) {
        var next = events.stream().filter(e -> n(e.getDaysToEvent()) >= 0).findFirst();
        long upcoming = events.stream().filter(e -> n(e.getDaysToEvent()) >= 0).count();
        long past = events.size() - upcoming;
        return ReportPdfLayout.render("Agenda de Temporada", subtitle(events, SeasonAgendaResponse::getSeasonName,
                "Temporada: ", "Calendario de Eventos"), pdf -> {
            pdf.summary(row("Eventos Próximos", upcoming), row("Eventos Pasados", past),
                    row("Próximo Evento", next.map(e -> "En " + n(e.getDaysToEvent()) + " días").orElse("Sin eventos")));
            pdf.table("Distribución de Eventos", columns("Estado", "Eventos"), List.of(row("Próximos", upcoming), row("Pasados", past)));
            pdf.table("Calendario Completo", columns("Evento", "Fecha", "Días hasta", "Fase", "Sede", "Ciudad"), events.stream()
                    .map(e -> row(e.getEventName(), e.getEventDate(), n(e.getDaysToEvent()), e.getPhase(), e.getVenueName(), e.getCityName())).toList());
        });
    }

    public byte[] matchLoad(List<TeamMatchLoadResponse> teams) {
        long home = sum(teams, TeamMatchLoadResponse::getHomeMatches);
        long away = sum(teams, TeamMatchLoadResponse::getAwayMatches);
        return ReportPdfLayout.render("Carga de Partidos", subtitle(teams, TeamMatchLoadResponse::getSeasonName,
                "Temporada: ", "Distribución Local vs Visitante"), pdf -> {
            pdf.summary(row("Partidos de Local", home), row("Partidos de Visitante", away), row("Total de Partidos", home + away));
            pdf.table("Carga de Partidos por Equipo (Top 10)", columns("Equipo", "Partidos"), teams.stream().limit(10)
                    .map(t -> row(t.getTeamName(), n(t.getTotalMatches()))).toList());
            pdf.table("Detalle Completo", columns("Equipo", "Club", "Local", "Visitante", "Total", "% Local"), teams.stream()
                    .map(t -> row(t.getTeamName(), t.getClubName(), n(t.getHomeMatches()), n(t.getAwayMatches()), n(t.getTotalMatches()),
                            percent(ratio(n(t.getHomeMatches()), n(t.getTotalMatches())) * 100))).toList());
        });
    }

    public byte[] scoringRanking(List<ScoringRankingResponse> teams) {
        var top = teams.isEmpty() ? null : teams.getFirst();
        return ReportPdfLayout.render("Ranking de Goleadores", subtitle(teams, ScoringRankingResponse::getSeasonName,
                "Temporada: ", "Estadísticas de Goles"), pdf -> {
            pdf.summary(row("Total de Goles", sum(teams, ScoringRankingResponse::getGoalsFor)),
                    row("Promedio Goles/Partido", fixed(avg(teams, ScoringRankingResponse::getGoalsPerMatch), 2)),
                    row("Equipo Más Goleador", top == null ? "-" : top.getTeamName() + ": " + n(top.getGoalsFor())));
            pdf.table("Top 10 Equipos Goleadores", columns("Equipo", "Goles"), teams.stream().limit(10)
                    .map(t -> row(t.getTeamName(), n(t.getGoalsFor()))).toList());
            pdf.table("Estadísticas Completas", columns("Equipo", "PJ", "GF", "GC", "DG", "GF/PJ", "GC/PJ"), teams.stream()
                    .map(t -> row(t.getTeamName(), n(t.getMatchesPlayed()), n(t.getGoalsFor()), n(t.getGoalsAgainst()),
                            n(t.getGoalDifference()), fixed(t.getGoalsPerMatch(), 2), fixed(t.getGoalsAgainstPerMatch(), 2))).toList());
        });
    }

    public byte[] staffRatio(List<TeamStaffRatioResponse> teams) {
        var roles = new LinkedHashMap<String, Long>();
        teams.forEach(t -> list(t.getRoleBreakdown()).forEach(role ->
                roles.merge(label(role.getRoleName(), "Desconocido"), n(role.getStaffCount()), Long::sum)));
        return ReportPdfLayout.render("Ratio Personal-Jugadores", "Proporción de staff técnico por jugador", pdf -> {
            pdf.summary(row("Personal Total", sum(teams, TeamStaffRatioResponse::getStaff)), row("Jugadores Total", sum(teams, TeamStaffRatioResponse::getPlayers)),
                    row("Ratio Promedio", fixed(avg(teams, TeamStaffRatioResponse::getStaffToPlayerRatio), 2)));
            pdf.table("Personal vs Jugadores (Top 10)", columns("Equipo", "Personal", "Jugadores"), teams.stream().limit(10)
                    .map(t -> row(t.getTeamName(), n(t.getStaff()), n(t.getPlayers()))).toList());
            if (!roles.isEmpty()) {
                pdf.table("Distribución por Rol", columns("Rol", "Personal"), aggregateRows(roles, roles.size()));
            }
            pdf.table("Detalle Completo", columns("Equipo", "Personal", "Jugadores", "Ratio", "Antigüedad"), teams.stream()
                    .map(t -> row(t.getTeamName(), n(t.getStaff()), n(t.getPlayers()), optional(t.getStaffToPlayerRatio(), 2, "-", ""),
                            optional(t.getAverageStaffTenure(), 1, "-", " años"))).toList());
        });
    }

    public byte[] pointsProgress(List<TeamPointsProgressResponse> matches) {
        long total = matches.isEmpty() ? 0 : n(matches.getLast().getCumulativePoints());
        return ReportPdfLayout.render("Progreso de Puntos", subtitle(matches, TeamPointsProgressResponse::getTeamName,
                "Equipo: ", "Evolución de Puntos por Jornada"), pdf -> {
            pdf.summary(row("Puntos Totales", total), row("Partidos Jugados", matches.size()),
                    row("Promedio por Partido", fixed(ratio(total, matches.size()), 2)));
            pdf.note("Los puntos se acumulan jornada tras jornada.");
            pdf.table("Evolución de Puntos Acumulados", columns("Jornada", "Puntos acumulados"), matches.stream()
                    .map(m -> row(matchday(m), n(m.getCumulativePoints()))).toList());
            pdf.table("Detalle por Jornada", columns("Jornada", "Fecha", "GF", "GC", "DG", "Pts Ganados", "Pts Acumulados"), matches.stream()
                    .map(m -> row(matchday(m), m.getMatchDate(), n(m.getGoalsFor()), n(m.getGoalsAgainst()), n(m.getGoalDifference()),
                            n(m.getPointsEarned()), n(m.getCumulativePoints()))).toList());
        });
    }

    public byte[] categoryParticipation(List<CategoryParticipationResponse> participation) {
        var categories = new LinkedHashMap<String, Long>();
        var genders = new LinkedHashMap<String, Long>();
        participation.forEach(r -> {
            categories.merge(label(r.getCategoryName(), "Sin categoría"), n(r.getMatchesCount()), Long::sum);
            genders.merge(label(r.getGenderName(), "Sin género"), n(r.getMatchesCount()), Long::sum);
        });
        return ReportPdfLayout.render("Participación por Categoría", "Análisis de participación por categoría y género", pdf -> {
            pdf.summary(row("Total de Partidos", sum(participation, CategoryParticipationResponse::getMatchesCount)),
                    row("Categorías", categories.size()), row("Géneros", genders.size()));
            pdf.table("Partidos por Categoría", columns("Categoría", "Partidos"), aggregateRows(categories, categories.size()));
            pdf.table("Distribución por Género", columns("Género", "Partidos"), aggregateRows(genders, genders.size()));
            pdf.table("Detalle Completo", columns("Club", "Categoría", "Género", "Partidos", "% Participación"), participation.stream()
                    .map(r -> row(r.getClubName(), r.getCategoryName(), r.getGenderName(), n(r.getMatchesCount()), percent(r.getParticipationPercentage()))).toList());
        });
    }

    public byte[] seasonStandings(List<SeasonStandingResponse> teams) {
        var top = teams.stream().max(Comparator.comparingLong(t -> n(t.getGoalsFor()))).orElse(null);
        return ReportPdfLayout.landscape("Tabla de Posiciones", subtitle(teams, SeasonStandingResponse::getSeasonName,
                "Temporada: ", "Reporte de Temporada"), pdf -> {
            pdf.summary(row("Equipos en Competencia", teams.size()), row("Promedio de Puntos", teams.isEmpty() ? "0" : fixed(avg(teams, SeasonStandingResponse::getPoints), 1)),
                    row("Máximo Goleador", top == null ? "-" : top.getTeamName() + ": " + n(top.getGoalsFor()) + " goles"));
            pdf.table("Distribución de Puntos (Top 10)", columns("Equipo", "Puntos"), teams.stream().limit(10)
                    .map(t -> row(t.getTeamName(), n(t.getPoints()))).toList());
            pdf.table("Clasificación Completa", columns("Pos", "Equipo", "PJ", "G", "E", "P", "GF", "GC", "DG", "Pts"), teams.stream()
                    .map(t -> row(t.getRankingPosition(), t.getTeamName(), n(t.getPlayed()), n(t.getWins()), n(t.getDraws()), n(t.getLosses()),
                            n(t.getGoalsFor()), n(t.getGoalsAgainst()), n(t.getGoalDifference()), n(t.getPoints()))).toList());
        });
    }

    public byte[] scheduleDensity(List<ScheduleDensityResponse> matches) {
        long lowRest = matches.stream().filter(m -> Boolean.TRUE.equals(m.getBelowRestThreshold())).count();
        long max = matches.stream().mapToLong(m -> n(m.getMatchesLastSevenDays()) + n(m.getMatchesNextSevenDays())).max().orElse(0);
        return ReportPdfLayout.render("Densidad del Calendario", subtitle(matches, ScheduleDensityResponse::getTeamName,
                "Equipo: ", "Análisis de Congestion de Partidos"), pdf -> {
            pdf.summary(row("Partidos con Poco Descanso", lowRest), row("Descanso Promedio", fixed(avg(matches, ScheduleDensityResponse::getRestDays), 1) + " días"),
                    row("Densidad Máxima", max + " partidos"));
            pdf.table("Evolución del Descanso y Densidad", columns("Fecha", "Días de Descanso", "Últimos 7d", "Próximos 7d"), matches.stream()
                    .map(m -> row(m.getMatchDate(), n(m.getRestDays()), n(m.getMatchesLastSevenDays()), n(m.getMatchesNextSevenDays()))).toList());
            pdf.table("Detalle Completo", columns("Fecha", "Días Descanso", "Últimos 7d", "Próximos 7d", "Duración (min)", "Alerta"), matches.stream()
                    .map(m -> row(m.getMatchDate(), n(m.getRestDays()), n(m.getMatchesLastSevenDays()), n(m.getMatchesNextSevenDays()),
                            n(m.getMatchDurationMinutes()), Boolean.TRUE.equals(m.getBelowRestThreshold()) ? "Sí" : "No")).toList());
        });
    }

    public byte[] staffImpact(StaffImpactResponse data) {
        var teams = list(data.getTeamDetails());
        return ReportPdfLayout.render("Impacto del Personal", "Correlación entre personal técnico y rendimiento del equipo", pdf -> {
            pdf.summary(row("Correlación Ratio-Victorias", optional(data.getRatioWinRateCorrelation(), 3, "N/A", "")),
                    row("Correlación Ratio-Puntos", optional(data.getRatioPointsCorrelation(), 3, "N/A", "")),
                    row("Ratio Staff Promedio", optional(data.getAverageStaffRatio(), 2, "N/A", "")));
            pdf.table("Ratio Staff vs % Victorias (Top 10)", columns("Equipo", "Ratio Staff/Jugador", "% Victorias"), teams.stream().limit(10)
                    .map(t -> row(t.getTeamName(), fixed(t.getStaffToPlayerRatio(), 2), percent(decimal(t.getWinRate()) * 100))).toList());
            pdf.table("Detalle Completo", columns("Equipo", "Ratio S/J", "% Victorias", "Pts/PJ", "DG", "PJ"), teams.stream()
                    .map(t -> row(t.getTeamName(), optional(t.getStaffToPlayerRatio(), 2, "-", ""), optional(decimal(t.getWinRate()) * 100, 1, "-", "%"),
                            optional(t.getPointsPerMatch(), 2, "-", ""), n(t.getGoalDifference()), n(t.getMatchesPlayed()))).toList());
        });
    }

    public byte[] paymentMethodPerformance(List<PaymentMethodPerformanceResponse> methods) {
        var revenue = moneySum(methods, PaymentMethodPerformanceResponse::getNetRevenue);
        long payments = sum(methods, PaymentMethodPerformanceResponse::getTotalPayments);
        var top = methods.stream().max(Comparator.comparing(m -> money(m.getNetRevenue()))).orElse(null);
        String leader = top == null ? "-" : label(top.getPaymentMethodName(), "-") + " (" + percent(top.getRevenueSharePercentage()) + ")";
        return ReportPdfLayout.landscape("Rendimiento por Metodo de Pago", top == null ? "Resumen de comportamientos por metodo de pago" : "Top: " + leader, pdf -> {
            pdf.summary(row("Ingresos netos", currency(revenue)), row("Pagos procesados", payments), row("Ticket promedio", currency(divideMoney(revenue, payments))));
            pdf.table("Ingresos netos por metodo", columns("Metodo", "Ingresos netos"), methods.stream()
                    .map(m -> row(m.getPaymentMethodName(), currency(m.getNetRevenue()))).toList());
            var shares = methods.stream().filter(m -> decimal(m.getRevenueSharePercentage()) > 0)
                    .map(m -> row(m.getPaymentMethodName(), percent(m.getRevenueSharePercentage()))).toList();
            if (!shares.isEmpty()) {
                pdf.table("Participacion en ingresos", columns("Metodo", "% Revenue"), shares);
            }
            pdf.table("Detalle completo", columns("Metodo", "Pagos", "Clientes", "Planes", "Ingresos netos", "Ticket", "% Revenue", "% Descuento", "Ultimo pago"), methods.stream()
                    .map(m -> row(m.getPaymentMethodName(), n(m.getTotalPayments()), n(m.getUniqueCustomers()), n(m.getPlansCovered()), currency(m.getNetRevenue()),
                            currency(m.getAverageTicket()), percent(m.getRevenueSharePercentage()), percent(m.getDiscountRatePercentage()),
                            m.getLastPaymentDate() == null ? "-" : m.getLastPaymentDate().format(PAYMENT_DATE))).toList());
            pdf.table("Indicadores adicionales", columns("Indicador", "Valor"), List.of(row("Descuentos aplicados", currency(moneySum(methods, PaymentMethodPerformanceResponse::getTotalDiscount))),
                    row("Metodo lider", leader), row("Clientes unicos", sum(methods, PaymentMethodPerformanceResponse::getUniqueCustomers))));
        });
    }

    public byte[] subscriptionPlanPerformance(List<SubscriptionPlanPerformanceResponse> plans) {
        long total = sum(plans, SubscriptionPlanPerformanceResponse::getTotalSubscriptions);
        long active = sum(plans, SubscriptionPlanPerformanceResponse::getActiveSubscriptions);
        long trial = sum(plans, SubscriptionPlanPerformanceResponse::getTrialSubscriptions);
        long suspended = sum(plans, SubscriptionPlanPerformanceResponse::getSuspendedSubscriptions);
        long inactive = sum(plans, SubscriptionPlanPerformanceResponse::getInactiveSubscriptions);
        long payments = sum(plans, SubscriptionPlanPerformanceResponse::getPaymentsCount);
        var revenue = moneySum(plans, SubscriptionPlanPerformanceResponse::getNetRevenue);
        var statuses = List.of(row("Activas", active), row("Trials", trial), row("Suspendidas", suspended), row("Inactivas", inactive))
                .stream().filter(r -> ((Long) r[1]) > 0).toList();
        return ReportPdfLayout.landscape("Salud de Planes de Suscripcion",
                "Promedio por plan: " + currency(divideMoney(revenue, plans.size())) + " | Pagos registrados: " + payments, pdf -> {
            pdf.summary(row("Suscripciones activas", active), row("Retencion global", percent(ratio(active, total) * 100)), row("Ingresos netos", currency(revenue)));
            pdf.table("Ingresos por plan", columns("Plan", "Ingresos netos"), plans.stream()
                    .map(p -> row(p.getPlanName(), currency(p.getNetRevenue()))).toList());
            if (!statuses.isEmpty()) {
                pdf.table("Distribucion de estados", columns("Estado", "Suscripciones"), statuses);
            }
            pdf.table("Detalle completo", columns("Plan", "Precio", "Suscripciones", "Activas", "Trial", "Suspendidas", "Inactivas", "Prox renov", "Churn rec", "Pagos", "Ingresos netos", "ARPU", "Retencion"), plans.stream()
                    .map(p -> row(p.getPlanName(), currency(p.getPlanPrice()), n(p.getTotalSubscriptions()), n(p.getActiveSubscriptions()), n(p.getTrialSubscriptions()),
                            n(p.getSuspendedSubscriptions()), n(p.getInactiveSubscriptions()), n(p.getUpcomingRenewals()), n(p.getChurnedRecently()), n(p.getPaymentsCount()),
                            currency(p.getNetRevenue()), currency(p.getArpu()), percent(p.getRetentionRatePercentage()))).toList());
            pdf.table("Alertas y renovaciones", columns("Indicador", "Valor"), List.of(
                    row("Renovaciones proximas", sum(plans, SubscriptionPlanPerformanceResponse::getUpcomingRenewals)),
                    row("Churn reciente", sum(plans, SubscriptionPlanPerformanceResponse::getChurnedRecently)), row("Trials activas", trial)));
        });
    }

    private static Object matchday(TeamPointsProgressResponse match) {
        return label(match.getMatchdayName(), null) == null ? match.getMatchNumber() : match.getMatchdayName();
    }

    private static <T> String subtitle(List<T> rows, Function<T, String> field, String prefix, String fallback) {
        String name = rows.isEmpty() ? null : field.apply(rows.getFirst());
        return name == null || name.isBlank() ? fallback : prefix + name;
    }

    private static String label(String value, String fallback) {
        return value == null || value.isBlank() ? fallback : value;
    }

    private static <T> List<T> list(List<T> rows) {
        return rows == null ? List.of() : rows;
    }

    private static List<Object[]> aggregateRows(Map<String, Long> totals, int limit) {
        return totals.entrySet().stream().limit(limit).map(e -> row(e.getKey(), e.getValue())).toList();
    }

    private static long n(Number n) {
        return n == null ? 0 : n.longValue();
    }

    private static double decimal(Number n) {
        return n == null ? 0 : n.doubleValue();
    }

    private static <T> long sum(List<T> rows, Function<T, ? extends Number> f) {
        return rows.stream().mapToLong(row -> n(f.apply(row))).sum();
    }

    private static <T> double avg(List<T> rows, Function<T, ? extends Number> f) {
        return rows.stream().mapToDouble(row -> decimal(f.apply(row))).average().orElse(0);
    }

    private static double ratio(double numerator, long denominator) {
        return denominator == 0 ? 0 : numerator / denominator;
    }

    private static String fixed(Number value, int digits) {
        return String.format(Locale.ROOT, "%." + digits + "f", decimal(value));
    }

    private static String optional(Number value, int digits, String missing, String suffix) {
        return decimal(value) == 0 ? missing : fixed(value, digits) + suffix;
    }

    private static String percent(Number value) {
        return fixed(value, 1) + "%";
    }

    private static BigDecimal money(BigDecimal amount) {
        return amount == null ? BigDecimal.ZERO : amount;
    }

    private static <T> BigDecimal moneySum(List<T> rows, Function<T, BigDecimal> f) {
        return rows.stream().map(f).map(AnalyticsReportPdf::money).reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    private static BigDecimal divideMoney(BigDecimal amount, long denominator) {
        return denominator == 0 ? BigDecimal.ZERO : amount.divide(BigDecimal.valueOf(denominator), 0, RoundingMode.HALF_UP);
    }

    private static String currency(BigDecimal value) {
        var formatter = NumberFormat.getCurrencyInstance(Locale.forLanguageTag("es-CO"));
        formatter.setMinimumFractionDigits(0);
        formatter.setMaximumFractionDigits(0);
        formatter.setRoundingMode(RoundingMode.HALF_UP);
        return formatter.format(money(value));
    }
}
