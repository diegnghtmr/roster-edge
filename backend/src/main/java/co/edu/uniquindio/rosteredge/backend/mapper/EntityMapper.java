package co.edu.uniquindio.rosteredge.backend.mapper;

import co.edu.uniquindio.rosteredge.backend.dto.UserDTO;
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
    dto.setBirthDate(entity.getBirthDate());
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
    entity.setBirthDate(dto.getBirthDate());
    return entity;
  }

}