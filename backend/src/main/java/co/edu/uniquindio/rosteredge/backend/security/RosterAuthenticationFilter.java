package co.edu.uniquindio.rosteredge.backend.security;

import co.edu.uniquindio.rosteredge.backend.exception.UnauthorizedException;
import co.edu.uniquindio.rosteredge.backend.model.Roster;
import co.edu.uniquindio.rosteredge.backend.service.RosterService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletRequestWrapper;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpHeaders;
import org.springframework.web.cors.CorsUtils;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.servlet.HandlerExceptionResolver;

import java.io.IOException;
import java.security.Principal;
import java.util.Collections;
import java.util.Enumeration;
import java.util.LinkedHashMap;
import java.util.Map;

public final class RosterAuthenticationFilter extends OncePerRequestFilter {

    private static final String TOKEN = RosterAuthenticationFilter.class.getName() + ".token";
    private final RosterService rosters;
    private final HandlerExceptionResolver errors;

    public RosterAuthenticationFilter(RosterService rosters, HandlerExceptionResolver errors) {
        this.rosters = rosters;
        this.errors = errors;
    }

    public static String sessionToken(HttpServletRequest request) {
        return (String) request.getAttribute(TOKEN);
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {
        if (isPublic(request) || CorsUtils.isPreFlightRequest(request)) {
            chain.doFilter(request, response);
            return;
        }
        String token;
        Roster roster;
        try {
            token = bearer(request);
            roster = rosters.resolveRoster(token).filter(account -> account.getClubId() != null)
                    .orElseThrow(() -> new UnauthorizedException("Invalid or expired token"));
        } catch (UnauthorizedException ex) {
            response.setHeader(HttpHeaders.WWW_AUTHENTICATE, "Bearer");
            errors.resolveException(request, response, null, ex);
            return;
        }
        request.setAttribute(TOKEN, token);
        var principal = new RosterPrincipal(roster.getId(), roster.getClubId(), roster.getName(), roster.getEmail(), roster.getSubscriptionId());
        chain.doFilter(new ScopedRequest(request, principal), response);
    }

    static String path(HttpServletRequest request) {
        return request.getRequestURI().substring(request.getContextPath().length());
    }

    static boolean isPublic(HttpServletRequest request) {
        String path = path(request);
        return switch (request.getMethod()) {
            case "GET", "HEAD" -> path.equals("/health/") || path.equals("/health/version/");
            case "POST" -> path.equals("/roster/login/");
            default -> false;
        };
    }

    private static String bearer(HttpServletRequest request) {
        var values = request.getHeaders(HttpHeaders.AUTHORIZATION);
        if (!values.hasMoreElements()) {
            throw new UnauthorizedException("Authorization header missing or invalid");
        }
        String value = values.nextElement();
        if (values.hasMoreElements() || !value.regionMatches(true, 0, "Bearer ", 0, 7)) {
            throw new UnauthorizedException("Authorization header missing or invalid");
        }
        String token = value.substring(7);
        if (!token.matches("[A-Za-z0-9_.-]{1,4096}")) {
            throw new UnauthorizedException("Authorization header missing or invalid");
        }
        return token;
    }

    private static final class ScopedRequest extends HttpServletRequestWrapper {
        private final RosterPrincipal principal;

        ScopedRequest(HttpServletRequest request, RosterPrincipal principal) {
            super(request);
            this.principal = principal;
        }

        @Override
        public Principal getUserPrincipal() {
            return principal;
        }

        @Override
        public String getRemoteUser() {
            return principal.getName();
        }

        @Override
        public String getParameter(String name) {
            return name.equals("clubId") ? Long.toString(principal.clubId()) : super.getParameter(name);
        }

        @Override
        public String[] getParameterValues(String name) {
            return name.equals("clubId") ? new String[]{getParameter(name)} : super.getParameterValues(name);
        }

        @Override
        public Map<String, String[]> getParameterMap() {
            var parameters = new LinkedHashMap<>(super.getParameterMap());
            parameters.put("clubId", getParameterValues("clubId"));
            return Collections.unmodifiableMap(parameters);
        }

        @Override
        public Enumeration<String> getParameterNames() {
            return Collections.enumeration(getParameterMap().keySet());
        }
    }
}
