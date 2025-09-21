package co.edu.uniquindio.rosteredge.backend.service;

import co.edu.uniquindio.rosteredge.backend.dto.UserDTO;
import co.edu.uniquindio.rosteredge.backend.model.User;

import java.util.List;
import java.util.Optional;

public interface UserService extends BaseService<User, Long> {

    Optional<User> findByEmail(String email);

    List<User> findActiveUsers();

    boolean existsByEmail(String email);

    UserDTO register(UserDTO userDTO);

    List<UserDTO> findAllUsers();

    UserDTO findUserById(Long id);

    // String login(String username, String password);

    // void logout(String token);

    // User updateProfile(Long userId, UserDTO userDTO, String authToken);
}
