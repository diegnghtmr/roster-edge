package co.edu.uniquindio.rosteredge.backend.service.impl;

import co.edu.uniquindio.rosteredge.backend.exception.UnauthorizedException;
import co.edu.uniquindio.rosteredge.backend.model.Roster;
import co.edu.uniquindio.rosteredge.backend.repository.RosterRepository;
import co.edu.uniquindio.rosteredge.backend.security.PasswordHasher;
import co.edu.uniquindio.rosteredge.backend.security.RosterSessionService;
import co.edu.uniquindio.rosteredge.backend.security.TokenService;
import co.edu.uniquindio.rosteredge.backend.service.RosterService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.Optional;

@Service
@Transactional
public class RosterServiceImpl extends SimpleCrudService<Roster> implements RosterService {

    private final RosterRepository repository;
    private final PasswordHasher passwordHasher;
    private final TokenService tokenService;
    private final RosterSessionService sessionService;

    public RosterServiceImpl(RosterRepository repository,
                             PasswordHasher passwordHasher,
                             TokenService tokenService,
                             RosterSessionService sessionService) {
        super(repository);
        this.repository = repository;
        this.passwordHasher = passwordHasher;
        this.tokenService = tokenService;
        this.sessionService = sessionService;
    }

    @Override
    protected String getEntityName() {
        return "Roster";
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Roster> findByEmail(String email) {
        return repository.findByEmail(email);
    }

    @Override
    public String authenticate(String email, String password) {
        Roster roster = findByEmail(email)
                .orElseThrow(() -> new UnauthorizedException("Invalid credentials"));

        if (!passwordHasher.matches(password, roster.getPasswordHash())) {
            throw new UnauthorizedException("Invalid credentials");
        }

        roster.setLastAccess(LocalDate.now());
        repository.save(roster);

        TokenService.TokenDetails tokenDetails = tokenService.generateToken(roster.getEmail());
        sessionService.register(tokenDetails.token(), roster.getEmail(), tokenDetails.expiresAt());
        return tokenDetails.token();
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Roster> resolveRoster(String token) {
        if (token == null || token.isBlank()) {
            return Optional.empty();
        }

        TokenService.TokenDetails details = tokenService.validateToken(token);
        return sessionService.resolveEmail(token)
                .filter(email -> email.equals(details.subject()))
                .flatMap(this::findByEmail);
    }

    @Override
    public void logout(String token) {
        sessionService.invalidate(token);
    }
}
