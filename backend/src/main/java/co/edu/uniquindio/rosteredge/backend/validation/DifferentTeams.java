package co.edu.uniquindio.rosteredge.backend.validation;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;
import java.lang.annotation.*;

/**
 * Validation annotation to ensure home team and away team are different
 */
@Documented
@Constraint(validatedBy = DifferentTeamsValidator.class)
@Target({ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
public @interface DifferentTeams {
    String message() default "Home team and away team must be different";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}
