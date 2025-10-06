package co.edu.uniquindio.rosteredge.backend.service.impl;

import co.edu.uniquindio.rosteredge.backend.dto.PlayerDTO;
import co.edu.uniquindio.rosteredge.backend.exception.BusinessException;
import co.edu.uniquindio.rosteredge.backend.exception.EntityNotFoundException;
import co.edu.uniquindio.rosteredge.backend.mapper.EntityMapper;
import co.edu.uniquindio.rosteredge.backend.security.PasswordHasher;
import co.edu.uniquindio.rosteredge.backend.model.Player;
import co.edu.uniquindio.rosteredge.backend.repository.PlayerRepository;
import co.edu.uniquindio.rosteredge.backend.service.PlayerService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
@Slf4j
@RequiredArgsConstructor
public class PlayerServiceImpl implements PlayerService {

    private final PlayerRepository playerRepository;
    private final EntityMapper entityMapper;
    private final PasswordHasher passwordHasher;

    @Override
    public PlayerDTO createPlayer(PlayerDTO playerDTO) {
        log.info("Creating player: {}", playerDTO.getName());
        Player player = entityMapper.toPlayerEntity(playerDTO);
        if (StringUtils.hasText(playerDTO.getPassword())) {
            player.setPasswordHash(passwordHasher.hash(playerDTO.getPassword()));
        } else if (StringUtils.hasText(playerDTO.getPasswordHash())) {
            player.setPasswordHash(playerDTO.getPasswordHash());
        }
        if (!StringUtils.hasText(player.getPasswordHash())) {
            throw new BusinessException("Password is required to create a player");
        }
        player.prePersist();
        Player savedPlayer = playerRepository.save(player);
        return entityMapper.toPlayerDTO(savedPlayer);
    }

    @Override
    @Transactional(readOnly = true)
    public List<PlayerDTO> findAllPlayers(Long teamId, Long primaryPositionId, Boolean active) {
        log.info("Finding players with filters - teamId: {}, primaryPositionId: {}, active: {}", teamId, primaryPositionId, active);
        return playerRepository.findByFilters(teamId, primaryPositionId, active)
                .stream()
                .map(entityMapper::toPlayerDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public PlayerDTO findPlayerById(Long id) {
        log.info("Finding player with id: {}", id);
        Player player = playerRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Player not found with id: " + id));
        return entityMapper.toPlayerDTO(player);
    }

    @Override
    public PlayerDTO updatePlayer(Long id, PlayerDTO playerDTO) {
        log.info("Updating player with id: {}", id);
        Player existingPlayer = playerRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Player not found with id: " + id));

        // Update user fields
        existingPlayer.setEmail(playerDTO.getEmail());
        existingPlayer.setName(playerDTO.getName());
        existingPlayer.setLastName(playerDTO.getLastName());
        existingPlayer.setCityId(playerDTO.getCityId());
        existingPlayer.setPhone(playerDTO.getPhone());
        existingPlayer.setBirthDate(playerDTO.getBirthDate() != null ? playerDTO.getBirthDate().toLocalDate() : null);
        if (StringUtils.hasText(playerDTO.getPassword())) {
            existingPlayer.setPasswordHash(passwordHasher.hash(playerDTO.getPassword()));
        } else if (StringUtils.hasText(playerDTO.getPasswordHash())) {
            existingPlayer.setPasswordHash(playerDTO.getPasswordHash());
        }

        // Update player fields
        existingPlayer.setPhysicalStateId(playerDTO.getPhysicalStateId());
        existingPlayer.setJerseyNumber(playerDTO.getJerseyNumber());
        existingPlayer.setHeight(playerDTO.getHeight());
        existingPlayer.setDominantFoot(playerDTO.getDominantFoot());
        existingPlayer.setWeight(playerDTO.getWeight());
        existingPlayer.setPrimaryPositionId(playerDTO.getPrimaryPositionId());
        existingPlayer.setTeamId(playerDTO.getTeamId());
        existingPlayer.preUpdate();

        Player updatedPlayer = playerRepository.save(existingPlayer);
        return entityMapper.toPlayerDTO(updatedPlayer);
    }

    @Override
    public void deletePlayer(Long id) {
        log.info("Deleting player with id: {}", id);
        if (!playerRepository.existsById(id)) {
            throw new EntityNotFoundException("Player not found with id: " + id);
        }
        playerRepository.deleteById(id);
    }
}






