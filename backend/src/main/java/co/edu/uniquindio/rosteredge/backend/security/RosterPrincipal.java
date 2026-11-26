package co.edu.uniquindio.rosteredge.backend.security;

import java.security.Principal;

public record RosterPrincipal(long rosterId, long clubId, String name, String email, Long subscriptionId)
        implements Principal {
    @Override
    public String getName() {
        return email;
    }
}
