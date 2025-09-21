package co.edu.uniquindio.rosteredge.backend.service;

import co.edu.uniquindio.rosteredge.backend.dto.ClubDTO;
import co.edu.uniquindio.rosteredge.backend.model.Club;

import java.util.List;

public interface ClubService extends BaseService<Club, Long> {
    ClubDTO createClub(ClubDTO clubDTO);
    List<ClubDTO> findAllClubs();
    ClubDTO findClubById(Long id);
    ClubDTO updateClub(Long id, ClubDTO clubDTO);
    void deleteClub(Long id);
}
