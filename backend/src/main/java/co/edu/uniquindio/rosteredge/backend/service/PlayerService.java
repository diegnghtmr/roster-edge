package co.edu.uniquindio.rosteredge.backend.service;

import co.edu.uniquindio.rosteredge.backend.dto.PlayerDTO;
import java.util.List;

public interface PlayerService {
    PlayerDTO createPlayer(PlayerDTO playerDTO);
    List<PlayerDTO> findAllPlayers();
    PlayerDTO findPlayerById(Long id);
    PlayerDTO updatePlayer(Long id, PlayerDTO playerDTO);
    void deletePlayer(Long id);
}
