package co.edu.uniquindio.rosteredge.backend.util;

/**
 * Utility methods to normalize optional filters received from controllers and services.
 */
public final class FilterUtils {

    private FilterUtils() {
        // Prevent instantiation
    }

    /**
     * Resolve the effective active flag applying default behaviour.
     *
     * @param active Flag received from client (may be null)
     * @return true when null to default to active entities; otherwise returns the original value
     */
    public static Boolean resolveActive(Boolean active) {
        return active != null ? active : Boolean.TRUE;
    }
}
