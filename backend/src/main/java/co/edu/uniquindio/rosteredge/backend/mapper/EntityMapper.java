package co.edu.uniquindio.rosteredge.backend.mapper;

import co.edu.uniquindio.rosteredge.backend.dto.ClubDTO;
import co.edu.uniquindio.rosteredge.backend.dto.EventDTO;
import co.edu.uniquindio.rosteredge.backend.dto.PlayerDTO;
import co.edu.uniquindio.rosteredge.backend.dto.SeasonDTO;
import co.edu.uniquindio.rosteredge.backend.dto.TeamDTO;
import co.edu.uniquindio.rosteredge.backend.dto.UserDTO;
import co.edu.uniquindio.rosteredge.backend.model.Club;
import co.edu.uniquindio.rosteredge.backend.model.Event;
import co.edu.uniquindio.rosteredge.backend.model.Player;
import co.edu.uniquindio.rosteredge.backend.model.Season;
import co.edu.uniquindio.rosteredge.backend.model.Team;
import co.edu.uniquindio.rosteredge.backend.model.User;
import org.springframework.stereotype.Component;

/**
 * Manual mapper for converting between entities and DTOs
 */
@Component
public class EntityMapper {

  // User mappings
  public UserDTO toUserDTO(User entity) {
    if (entity == null)
      return null;

    UserDTO dto = new UserDTO();
    dto.setId(entity.getId());
    dto.setCreatedAt(entity.getCreatedAt());
    dto.setUpdatedAt(entity.getUpdatedAt());
    dto.setActive(entity.getActive());
    dto.setEmail(entity.getEmail());
    dto.setPasswordHash(entity.getPasswordHash());
    dto.setName(entity.getName());
    dto.setLastName(entity.getLastName());
    dto.setCityId(entity.getCityId());
    dto.setPhone(entity.getPhone());
    dto.setBirthDate(entity.getBirthDate() != null ? entity.getBirthDate().atStartOfDay() : null);
    return dto;
  }

  public User toUserEntity(UserDTO dto) {
    if (dto == null)
      return null;

    User entity = new User();
    entity.setId(dto.getId());
    entity.setCreatedAt(dto.getCreatedAt());
    entity.setUpdatedAt(dto.getUpdatedAt());
    entity.setActive(dto.getActive());
    entity.setEmail(dto.getEmail());
    entity.setPasswordHash(dto.getPasswordHash());
    entity.setName(dto.getName());
    entity.setLastName(dto.getLastName());
    entity.setCityId(dto.getCityId());
    entity.setPhone(dto.getPhone());
    entity.setBirthDate(dto.getBirthDate() != null ? dto.getBirthDate().toLocalDate() : null);
    return entity;
  }

  // Club mappings
  public ClubDTO toClubDTO(Club entity) {
    if (entity == null)
      return null;

    ClubDTO dto = new ClubDTO();
    dto.setId(entity.getId());
    dto.setCreatedAt(entity.getCreatedAt());
    dto.setUpdatedAt(entity.getUpdatedAt());
    dto.setActive(entity.getActive());
    dto.setName(entity.getName());
    dto.setMotto(entity.getMotto());
    dto.setFoundation(entity.getFoundation());
    return dto;
  }

  public Club toClubEntity(ClubDTO dto) {
    if (dto == null)
      return null;

    Club entity = new Club();
    entity.setId(dto.getId());
    entity.setCreatedAt(dto.getCreatedAt());
    entity.setUpdatedAt(dto.getUpdatedAt());
    entity.setActive(dto.getActive());
    entity.setName(dto.getName());
    entity.setMotto(dto.getMotto());
    entity.setFoundation(dto.getFoundation());
    return entity;
  }

  // Season mappings
  public SeasonDTO toSeasonDTO(Season entity) {
    if (entity == null)
      return null;

    SeasonDTO dto = new SeasonDTO();
    dto.setId(entity.getId());
    dto.setCreatedAt(entity.getCreatedAt());
    dto.setUpdatedAt(entity.getUpdatedAt());
    dto.setActive(entity.getActive());
    dto.setClubId(entity.getClubId());
    dto.setName(entity.getName());
    dto.setStartDate(entity.getStartDate());
    dto.setEndDate(entity.getEndDate());
    return dto;
  }

  public Season toSeasonEntity(SeasonDTO dto) {
    if (dto == null)
      return null;

    Season entity = new Season();
    entity.setId(dto.getId());
    entity.setCreatedAt(dto.getCreatedAt());
    entity.setUpdatedAt(dto.getUpdatedAt());
    entity.setActive(dto.getActive());
    entity.setClubId(dto.getClubId());
    entity.setName(dto.getName());
    entity.setStartDate(dto.getStartDate());
    entity.setEndDate(dto.getEndDate());
    return entity;
  }

  // Team mappings
  public TeamDTO toTeamDTO(Team entity) {
    if (entity == null)
      return null;

    TeamDTO dto = new TeamDTO();
    dto.setId(entity.getId());
    dto.setCreatedAt(entity.getCreatedAt());
    dto.setUpdatedAt(entity.getUpdatedAt());
    dto.setActive(entity.getActive());
    dto.setName(entity.getName());
    dto.setGenderId(entity.getGenderId());
    dto.setCategoryId(entity.getCategoryId());
    dto.setMascot(entity.getMascot());
    dto.setFoundation(entity.getFoundation());
    dto.setClubId(entity.getClubId());
    return dto;
  }

  public Team toTeamEntity(TeamDTO dto) {
    if (dto == null)
      return null;

    Team entity = new Team();
    entity.setId(dto.getId());
    entity.setCreatedAt(dto.getCreatedAt());
    entity.setUpdatedAt(dto.getUpdatedAt());
    entity.setActive(dto.getActive());
    entity.setName(dto.getName());
    entity.setGenderId(dto.getGenderId());
    entity.setCategoryId(dto.getCategoryId());
    entity.setMascot(dto.getMascot());
    entity.setFoundation(dto.getFoundation());
    entity.setClubId(dto.getClubId());
    return entity;
  }

  // Player mappings
  public PlayerDTO toPlayerDTO(Player entity) {
    if (entity == null)
      return null;

    PlayerDTO dto = new PlayerDTO();
    // User fields
    dto.setId(entity.getId());
    dto.setCreatedAt(entity.getCreatedAt());
    dto.setUpdatedAt(entity.getUpdatedAt());
    dto.setActive(entity.getActive());
    dto.setEmail(entity.getEmail());
    dto.setPasswordHash(entity.getPasswordHash());
    dto.setName(entity.getName());
    dto.setLastName(entity.getLastName());
    dto.setCityId(entity.getCityId());
    dto.setPhone(entity.getPhone());
    dto.setBirthDate(entity.getBirthDate() != null ? entity.getBirthDate().atStartOfDay() : null);

    // Player fields
    dto.setPhysicalStateId(entity.getPhysicalStateId());
    dto.setJerseyNumber(entity.getJerseyNumber());
    dto.setHeight(entity.getHeight());
    dto.setDominantFoot(entity.getDominantFoot());
    dto.setWeight(entity.getWeight());
    dto.setPrimaryPositionId(entity.getPrimaryPositionId());
    dto.setTeamId(entity.getTeamId());
    return dto;
  }

  public Player toPlayerEntity(PlayerDTO dto) {
    if (dto == null)
      return null;

    Player entity = new Player();
    // User fields
    entity.setId(dto.getId());
    entity.setCreatedAt(dto.getCreatedAt());
    entity.setUpdatedAt(dto.getUpdatedAt());
    entity.setActive(dto.getActive());
    entity.setEmail(dto.getEmail());
    entity.setPasswordHash(dto.getPasswordHash());
    entity.setName(dto.getName());
    entity.setLastName(dto.getLastName());
    entity.setCityId(dto.getCityId());
    entity.setPhone(dto.getPhone());
    entity.setBirthDate(dto.getBirthDate() != null ? dto.getBirthDate().toLocalDate() : null);

    // Player fields
    entity.setPhysicalStateId(dto.getPhysicalStateId());
    entity.setJerseyNumber(dto.getJerseyNumber());
    entity.setHeight(dto.getHeight());
    entity.setDominantFoot(dto.getDominantFoot());
    entity.setWeight(dto.getWeight());
    entity.setPrimaryPositionId(dto.getPrimaryPositionId());
    entity.setTeamId(dto.getTeamId());
    return entity;
  }

  // Event mappings
  public EventDTO toEventDTO(Event entity) {
    if (entity == null)
      return null;

    EventDTO dto = new EventDTO();
    dto.setId(entity.getId());
    dto.setCreatedAt(entity.getCreatedAt());
    dto.setUpdatedAt(entity.getUpdatedAt());
    dto.setActive(entity.getActive());
    dto.setSeasonId(entity.getSeasonId());
    dto.setVenueId(entity.getVenueId());
    dto.setName(entity.getName());
    dto.setDescription(entity.getDescription());
    dto.setDate(entity.getDate());
    return dto;
  }

  public Event toEventEntity(EventDTO dto) {
    if (dto == null)
      return null;

    Event entity = new Event();
    entity.setId(dto.getId());
    entity.setCreatedAt(dto.getCreatedAt());
    entity.setUpdatedAt(dto.getUpdatedAt());
    entity.setActive(dto.getActive());
    entity.setSeasonId(dto.getSeasonId());
    entity.setVenueId(dto.getVenueId());
    entity.setName(dto.getName());
    entity.setDescription(dto.getDescription());
    entity.setDate(dto.getDate());
    return entity;
  }
}
