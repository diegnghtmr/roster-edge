package co.edu.uniquindio.rosteredge.backend.security;

import co.edu.uniquindio.rosteredge.backend.exception.EntityNotFoundException;

public final class ClubScopeDeniedException extends EntityNotFoundException {
    ClubScopeDeniedException() {
        super("Resource not found");
    }
}
