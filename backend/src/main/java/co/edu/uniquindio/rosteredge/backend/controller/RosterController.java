package co.edu.uniquindio.rosteredge.backend.controller;

import co.edu.uniquindio.rosteredge.backend.dto.ApiResponse;
import co.edu.uniquindio.rosteredge.backend.dto.request.RosterLoginRequest;
import co.edu.uniquindio.rosteredge.backend.dto.response.RosterLoginResponse;
import co.edu.uniquindio.rosteredge.backend.dto.response.RosterSessionResponse;
import co.edu.uniquindio.rosteredge.backend.security.RosterAuthenticationFilter;
import co.edu.uniquindio.rosteredge.backend.security.RosterPrincipal;
import co.edu.uniquindio.rosteredge.backend.service.RosterService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/roster")
public class RosterController {

    private final RosterService rosterService;

    public RosterController(RosterService rosterService) {
        this.rosterService = rosterService;
    }

    @PostMapping("/login/")
    public ResponseEntity<ApiResponse<RosterLoginResponse>> login(@Valid @RequestBody RosterLoginRequest request) {
        String token = rosterService.authenticate(request.getEmail(), request.getPassword());
        return ResponseEntity.ok(ApiResponse.success(new RosterLoginResponse(token), "Login successful"));
    }

    @GetMapping("/me/")
    public ResponseEntity<ApiResponse<RosterSessionResponse>> currentRoster(RosterPrincipal principal) {
        return ResponseEntity.ok(ApiResponse.success(new RosterSessionResponse(principal.rosterId(),
                principal.name(), principal.email(), principal.clubId(), principal.subscriptionId())));
    }

    @PostMapping("/logout/")
    public ResponseEntity<ApiResponse<Void>> logout(HttpServletRequest request) {
        rosterService.logout(RosterAuthenticationFilter.sessionToken(request));
        return ResponseEntity.ok(ApiResponse.<Void>success(null, "Logout successful"));
    }
}
