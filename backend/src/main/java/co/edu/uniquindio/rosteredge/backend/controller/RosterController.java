package co.edu.uniquindio.rosteredge.backend.controller;

import co.edu.uniquindio.rosteredge.backend.dto.ApiResponse;
import co.edu.uniquindio.rosteredge.backend.dto.request.RosterLoginRequest;
import co.edu.uniquindio.rosteredge.backend.dto.response.RosterLoginResponse;
import co.edu.uniquindio.rosteredge.backend.dto.response.RosterSessionResponse;
import co.edu.uniquindio.rosteredge.backend.exception.UnauthorizedException;
import co.edu.uniquindio.rosteredge.backend.model.Roster;
import co.edu.uniquindio.rosteredge.backend.service.RosterService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Authentication controller for roster administrators.
 */
@RestController
@RequestMapping("/roster")
public class RosterController {

    private static final String BEARER_PREFIX = "Bearer ";

    private final RosterService rosterService;

    public RosterController(RosterService rosterService) {
        this.rosterService = rosterService;
    }

    @PostMapping("/login/")
    public ResponseEntity<ApiResponse<RosterLoginResponse>> login(@Valid @RequestBody RosterLoginRequest request) {
        String token = rosterService.authenticate(request.getEmail(), request.getPassword());
        return ResponseEntity.ok(ApiResponse.success(new RosterLoginResponse(token), "Login successful"));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<RosterSessionResponse>> currentRoster(
            @RequestHeader(value = "Authorization", required = false) String authorization) {
        String token = resolveToken(authorization);
        Roster roster = rosterService.resolveRoster(token)
                .orElseThrow(() -> new UnauthorizedException("Invalid or expired token"));

        RosterSessionResponse response = new RosterSessionResponse(
                roster.getId(),
                roster.getName(),
                roster.getEmail(),
                roster.getClubId(),
                roster.getSubscriptionId());

        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<Void>> logout(
            @RequestHeader(value = "Authorization", required = false) String authorization) {
        String token = resolveToken(authorization);
        rosterService.logout(token);
        return ResponseEntity.ok(ApiResponse.<Void>success(null, "Logout successful"));
    }

    private String resolveToken(String authorizationHeader) {
        if (authorizationHeader == null || !authorizationHeader.startsWith(BEARER_PREFIX)) {
            throw new UnauthorizedException("Authorization header missing or invalid");
        }
        String token = authorizationHeader.substring(BEARER_PREFIX.length()).trim();
        if (token.isEmpty()) {
            throw new UnauthorizedException("Authorization header missing or invalid");
        }
        return token;
    }
}

