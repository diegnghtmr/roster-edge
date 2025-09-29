package co.edu.uniquindio.rosteredge.backend.security;

import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;

/**
 * In-memory registry of active roster tokens to enable optional session-aware endpoints.
 */
@Component
public class RosterSessionService {

    private final ConcurrentMap<String, SessionInfo> sessions = new ConcurrentHashMap<>();

    public void register(String token, String email, long expiresAt) {
        sessions.put(token, new SessionInfo(email, expiresAt));
    }

    public Optional<String> resolveEmail(String token) {
        if (token == null || token.isBlank()) {
            return Optional.empty();
        }
        SessionInfo info = sessions.get(token);
        if (info == null) {
            return Optional.empty();
        }
        long now = Instant.now().getEpochSecond();
        if (info.expiresAt() < now) {
            sessions.remove(token);
            return Optional.empty();
        }
        return Optional.of(info.email());
    }

    public void invalidate(String token) {
        if (token == null || token.isBlank()) {
            return;
        }
        sessions.remove(token);
    }

    private record SessionInfo(String email, long expiresAt) {
    }
}
