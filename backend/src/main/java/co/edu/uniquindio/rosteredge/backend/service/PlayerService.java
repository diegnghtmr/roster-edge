package co.edu.uniquindio.rosteredge.backend.service;

import co.edu.uniquindio.rosteredge.backend.model.Player;
import java.util.List;

public interface PlayerService extends BaseService<Player, Long> {
    List<Player> findByTeamId(Long teamId);
    List<Player> findByPrimaryPositionId(Long primaryPositionId);
    List<Player> findActivePlayer();
}
