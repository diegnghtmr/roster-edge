package co.edu.uniquindio.rosteredge.backend.security;

import co.edu.uniquindio.rosteredge.backend.controller.BaseController;
import co.edu.uniquindio.rosteredge.backend.dto.ApiResponse;
import co.edu.uniquindio.rosteredge.backend.dto.request.RosterWriteRequest;
import co.edu.uniquindio.rosteredge.backend.dto.response.NotificationResponse;
import co.edu.uniquindio.rosteredge.backend.model.Staff;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.PropertyAccessorFactory;
import org.springframework.core.MethodParameter;
import org.springframework.http.HttpInputMessage;
import org.springframework.http.MediaType;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.http.server.ServletServerHttpRequest;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.mvc.method.annotation.RequestBodyAdviceAdapter;
import org.springframework.web.servlet.mvc.method.annotation.ResponseBodyAdvice;

import java.lang.reflect.Type;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.regex.Pattern;

/** Explicit API policy, independent of controller-specific binding and repository implementations. */
@RestControllerAdvice
public final class RosterAuthorization extends RequestBodyAdviceAdapter implements HandlerInterceptor, ResponseBodyAdvice<Object> {

    private static final Pattern CRUD = Pattern.compile("/([a-z-]+)/(?:([1-9][0-9]{0,18})/?)?");
    private static final Pattern RESULT = Pattern.compile("/matches/([1-9][0-9]{0,18})/result/");
    private static final String ROUTE = RosterAuthorization.class.getName() + ".route";
    private static final Set<String> CATALOGS = Set.of("countries", "cities", "colors", "currencies", "matchdays", "payment-methods",
            "physical-states", "plan-benefits", "plans", "player-positions", "staff-roles", "subscription-statuses", "team-categories", "team-genders");
    private static final Set<String> TENANTS = Set.of("clubs", "teams", "rosters", "seasons", "venues", "stadiums", "events", "matches",
            "players", "staff", "streaks", "notifications", "subscriptions", "payments", "users", "club-events");
    private static final Set<String> WRITABLE = Set.of("teams", "seasons", "venues", "stadiums", "events", "matches", "players",
            "staff", "streaks", "club-events", "rosters");
    private static final Set<String> CANNOT_CREATE = Set.of("rosters");
    private static final Set<String> FILTERED_VIEWS = Set.of("/teams/insights/", "/matches/schedule/", "/players/overview/", "/subscriptions/coverage/");
    private static final Map<String, Map<String, String>> RELATION_LISTS = Map.of(
            "match-home-teams", Map.of("matchId", "matches", "teamId", "teams"),
            "match-away-teams", Map.of("matchId", "matches", "teamId", "teams"),
            "team-colors", Map.of("teamId", "teams"),
            "notification-club-events", Map.of("clubEventId", "club-events", "notificationId", "notifications"));
    private static final Set<String> REPORTS = Set.of("roster-profile", "season-agenda", "match-load", "scoring-ranking", "staff-ratio",
            "points-progress", "category-participation", "season-standings", "schedule-density", "staff-impact",
            "payment-method-performance", "subscription-plan-performance");
    private static final String REPORT_PREFIX = "/analytics/reports/";

    private record Route(String resource, Long id, boolean scopeList) { }
    private final ClubOwnership ownership;
    private final PasswordHasher passwords;

    RosterAuthorization(ClubOwnership ownership, PasswordHasher passwords) {
        this.ownership = ownership;
        this.passwords = passwords;
    }

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
        if (RosterAuthenticationFilter.isPublic(request)) {
            return true;
        }
        if (!(handler instanceof HandlerMethod method) || !(request.getUserPrincipal() instanceof RosterPrincipal principal)) {
            throw notFound();
        }
        String path = RosterAuthenticationFilter.path(request);
        String verb = request.getMethod();
        boolean read = verb.equals("GET") || verb.equals("HEAD");
        if ((read && path.equals("/roster/me/")) || (verb.equals("POST") && path.equals("/roster/logout/"))) {
            return true;
        }
        if (read && isReportRead(path)) {
            requireClubBinding(method);
            return true;
        }
        if (read && FILTERED_VIEWS.contains(path)) {
            requireClubBinding(method);
            if (path.equals("/matches/schedule/")) {
                request.setAttribute(ROUTE, new Route("matches", null, true));
            }
            return true;
        }
        var result = RESULT.matcher(path);
        if ((verb.equals("POST") || verb.equals("PUT")) && result.matches()) {
            ownership.require("matches", id(result.group(1)), principal);
            return true;
        }
        var crud = CRUD.matcher(path);
        if (!crud.matches()) {
            throw notFound();
        }
        String resource = crud.group(1);
        Long id = crud.group(2) == null ? null : id(crud.group(2));
        if (CATALOGS.contains(resource) && read) {
            return true;
        }
        if (RELATION_LISTS.containsKey(resource) && read && id == null) {
            request.setAttribute(ROUTE, new Route(resource, null, true));
            return true;
        }
        if (!TENANTS.contains(resource) || (!read && !allowedWrite(resource, id, verb))) {
            throw notFound();
        }
        if (id != null) {
            ownership.require(resource, id, principal);
        }
        request.setAttribute(ROUTE, new Route(resource, id, read && id == null));
        return true;
    }

    private static boolean isReportRead(String path) {
        if (!path.startsWith(REPORT_PREFIX) || !path.endsWith("/")) {
            return false;
        }
        String route = path.substring(REPORT_PREFIX.length());
        String suffix = route.endsWith("/pdf/") ? "/pdf/" : "/";
        return route.length() > suffix.length() && REPORTS.contains(route.substring(0, route.length() - suffix.length()));
    }

    private static void requireClubBinding(HandlerMethod method) {
        // A report/view without a bindable club filter is never silently treated as tenant-scoped.
        if (Arrays.stream(method.getMethodParameters()).map(MethodParameter::getParameterType)
                .map(type -> BeanUtils.getPropertyDescriptor(type, "clubId"))
                .noneMatch(property -> property != null && property.getWriteMethod() != null)) {
            throw notFound();
        }
    }

    private static boolean allowedWrite(String resource, Long id, String verb) {
        if (!WRITABLE.contains(resource)) {
            return false;
        }
        return id == null ? verb.equals("POST") && !CANNOT_CREATE.contains(resource)
                : verb.equals("PUT") || verb.equals("DELETE");
    }

    @Override
    public boolean supports(MethodParameter parameter, Type target, Class<? extends HttpMessageConverter<?>> converter) {
        return true;
    }

    @Override
    public Object afterBodyRead(Object body, HttpInputMessage message, MethodParameter parameter, Type target,
                                Class<? extends HttpMessageConverter<?>> converter) {
        var attributes = (ServletRequestAttributes) RequestContextHolder.currentRequestAttributes();
        var request = attributes.getRequest();
        if (!(request.getAttribute(ROUTE) instanceof Route route)) {
            return body;
        }
        var principal = (RosterPrincipal) request.getUserPrincipal();
        if (body instanceof RosterWriteRequest roster) {
            if (roster.clubId() != null && roster.clubId() != principal.clubId()) {
                throw notFound();
            }
            return body;
        }
        Long bodyId = longProperty(body, "id");
        if (bodyId != null && !bodyId.equals(route.id())) {
            throw notFound();
        }
        switch (route.resource()) {
            case "teams", "seasons", "venues", "club-events" -> {
                var fields = PropertyAccessorFactory.forBeanPropertyAccess(body);
                Long suppliedClub = longProperty(body, "clubId");
                if (suppliedClub != null && suppliedClub != principal.clubId()) {
                    throw notFound();
                }
                fields.setPropertyValue("clubId", principal.clubId());
            }
            default -> { }
        }
        switch (route.resource()) {
            case "players", "staff", "streaks" -> reference(body, "teamId", "teams", principal, true);
            case "stadiums" -> reference(body, "venueId", "venues", principal, true);
            case "events" -> {
                reference(body, "seasonId", "seasons", principal, true);
                reference(body, "venueId", "venues", principal, false);
            }
            case "club-events" -> reference(body, "eventId", "events", principal, true);
            case "matches" -> {
                reference(body, "homeTeamId", "teams", principal, true);
                reference(body, "awayTeamId", "teams", principal, true);
                reference(body, "eventId", "events", principal, true);
                reference(body, "stadiumId", "stadiums", principal, true);
            }
            default -> { }
        }
        if (body instanceof Staff staff) {
            String suppliedPassword = staff.getPasswordHash();
            if (suppliedPassword != null && !suppliedPassword.isBlank() && suppliedPassword.length() <= 255) {
                staff.setPasswordHash(passwords.hash(suppliedPassword));
            }
        }
        return body;
    }

    private void reference(Object body, String property, String resource, RosterPrincipal principal, boolean required) {
        Long id = longProperty(body, property);
        if (id == null) {
            if (required) {
                throw notFound();
            }
        } else {
            ownership.require(resource, id, principal);
        }
    }

    private static Long longProperty(Object body, String property) {
        var accessor = PropertyAccessorFactory.forBeanPropertyAccess(body);
        return accessor.isReadableProperty(property) && accessor.getPropertyValue(property) instanceof Number number
                ? number.longValue() : null;
    }

    @Override
    public boolean supports(MethodParameter parameter, Class<? extends HttpMessageConverter<?>> converter) {
        return true;
    }

    @Override
    public Object beforeBodyWrite(Object body, MethodParameter parameter, MediaType mediaType,
                                  Class<? extends HttpMessageConverter<?>> converter, ServerHttpRequest incoming,
                                  ServerHttpResponse response) {
        if (!(incoming instanceof ServletServerHttpRequest servlet)
                || !(servlet.getServletRequest().getAttribute(ROUTE) instanceof Route route) || !route.scopeList()) {
            return body;
        }
        var principal = (RosterPrincipal) servlet.getServletRequest().getUserPrincipal();
        if (body instanceof ApiResponse<?> envelope) {
            if (!envelope.isSuccess()) {
                return body;
            }
            if (envelope.getData() instanceof List<?> rows) {
                return ApiResponse.builder().success(true).message(envelope.getMessage()).timestamp(envelope.getTimestamp())
                        .data(scopedRows(rows, route.resource(), principal)).build();
            }
        }
        if (body instanceof BaseController.ApiResponse<?> envelope) {
            if (!envelope.isSuccess()) {
                return body;
            }
            if (envelope.getData() instanceof List<?> rows) {
                return BaseController.ApiResponse.success(scopedRows(rows, route.resource(), principal), envelope.getMessage());
            }
        }
        throw notFound();
    }

    private List<?> scopedRows(List<?> rows, String resource, RosterPrincipal principal) {
        if (rows.isEmpty()) {
            return rows;
        }
        var relations = RELATION_LISTS.getOrDefault(resource, Map.of("id", resource));
        Map<String, Set<Long>> allowed = new HashMap<>();
        relations.forEach((property, target) -> allowed.put(property, ownership.allowedIds(target, principal)));
        var scoped = rows.stream().filter(row -> allowed.entrySet().stream()
                .allMatch(entry -> entry.getValue().contains(longProperty(row, entry.getKey())))).toList();
        scoped.forEach(row -> {
            if (row instanceof NotificationResponse notification && notification.getRelatedClubEvents() != null) {
                notification.setRelatedClubEvents(notification.getRelatedClubEvents().stream()
                        .filter(event -> Long.valueOf(principal.clubId()).equals(event.getClubId())).toList());
            }
        });
        return scoped;
    }

    private static long id(String candidate) {
        try {
            return Long.parseLong(candidate);
        } catch (NumberFormatException ex) {
            throw notFound();
        }
    }

    private static ClubScopeDeniedException notFound() {
        return new ClubScopeDeniedException();
    }
}
