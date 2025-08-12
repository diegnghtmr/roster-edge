package co.edu.uniquindio.rosteredge.backend.exception;

public class EntityNotFoundException extends RuntimeException {
    
    public EntityNotFoundException(String message) {
        super(message);
    }
    
    public EntityNotFoundException(String entityName, String id) {
        super(String.format("%s not found with id: %s", entityName, id));
    }
    
    public EntityNotFoundException(String entityName, Long id) {
        super(String.format("%s not found with id: %d", entityName, id));
    }
    
    public EntityNotFoundException(String entityName, String field, String value) {
        super(String.format("%s not found with %s: %s", entityName, field, value));
    }
}
