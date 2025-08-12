package co.edu.uniquindio.rosteredge.backend.service;

import co.edu.uniquindio.rosteredge.backend.dto.UserDTO;
import co.edu.uniquindio.rosteredge.backend.model.User;

import java.util.List;
import java.util.Optional;

public interface UserService extends BaseService<User, Long> {
    
    Optional<User> findByUsername(String username);
    
    Optional<User> findByEmail(String email);
    
    Optional<User> findByAuthToken(String token);
    
    List<User> findByRole(String role);
    
    List<User> findByStatus(String status);
    
    List<User> findActiveUsers();
    
    boolean existsByUsername(String username);
    
    boolean existsByEmail(String email);
    
    User register(UserDTO userDTO);
    
    String login(String username, String password);
    
    void logout(String token);
    
    User updateProfile(Long userId, UserDTO userDTO, String authToken);
}
