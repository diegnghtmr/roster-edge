package co.edu.uniquindio.rosteredge.backend.controller;

import co.edu.uniquindio.rosteredge.backend.dto.ApiResponse;
import co.edu.uniquindio.rosteredge.backend.dto.request.MatchResultRequest;
import co.edu.uniquindio.rosteredge.backend.service.report.MatchResultService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/** PUT /matches/{id}/result/ records or replaces the score for the current participants. */
@RestController
@RequestMapping("/matches/{id}/result/")
@RequiredArgsConstructor
public class MatchResultController {

    private final MatchResultService matchResults;

    @PutMapping
    public ApiResponse<MatchResultRequest> recordResult(@PathVariable long id,
            @Valid @RequestBody MatchResultRequest request) {
        matchResults.recordResult(id, request);
        return ApiResponse.success(request, "Match result recorded successfully");
    }
}
