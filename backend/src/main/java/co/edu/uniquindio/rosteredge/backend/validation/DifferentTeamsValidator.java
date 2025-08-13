package co.edu.uniquindio.rosteredge.backend.validation;

import co.edu.uniquindio.rosteredge.backend.dto.request.MatchRequest;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

/**
 * Validator implementation for DifferentTeams constraint
 */
public class DifferentTeamsValidator implements ConstraintValidator<DifferentTeams, MatchRequest> {
    
    @Override
    public void initialize(DifferentTeams constraintAnnotation) {
        // No initialization needed
    }
    
    @Override
    public boolean isValid(MatchRequest matchRequest, ConstraintValidatorContext context) {
        if (matchRequest == null) {
            return true; // Let @NotNull handle null validation
        }
        
        Long homeTeamId = matchRequest.getHomeTeamId();
        Long awayTeamId = matchRequest.getAwayTeamId();
        
        if (homeTeamId == null || awayTeamId == null) {
            return true; // Let @NotNull handle null validation
        }
        
        return !homeTeamId.equals(awayTeamId);
    }
}
