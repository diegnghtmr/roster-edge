package co.edu.uniquindio.rosteredge.backend.service.impl;

import co.edu.uniquindio.rosteredge.backend.dto.UserDTO;
import co.edu.uniquindio.rosteredge.backend.exception.BusinessException;
import co.edu.uniquindio.rosteredge.backend.exception.UnauthorizedException;
import co.edu.uniquindio.rosteredge.backend.mapper.EntityMapper;
import co.edu.uniquindio.rosteredge.backend.model.User;
import co.edu.uniquindio.rosteredge.backend.repository.UserRepository;
import co.edu.uniquindio.rosteredge.backend.service.AbstractBaseService;
import co.edu.uniquindio.rosteredge.backend.service.UserService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Base64;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@Transactional
@Slf4j
public class UserServiceImpl extends AbstractBaseService<User, Long> implements UserService {
    
    private final UserRepository userRepository;
    private final EntityMapper mapper;
    
    public UserServiceImpl(UserRepository userRepository, EntityMapper mapper) {
        super(userRepository);
        this.userRepository = userRepository;
        this.mapper = mapper;
    }
    
    @Override
    protected String getEntityName() {
        return "User";
    }
    
    @Override
    @Cacheable("users")
    public Optional<User> findByUsername(String username) {
        log.debug("Finding user by username: {}", username);
        return userRepository.findByUsername(username);
    }
    
    @Override
    public Optional<User> findByEmail(String email) {
        log.debug("Finding user by email: {}", email);
        return userRepository.findByEmail(email);
    }
    
    @Override
    public Optional<User> findByAuthToken(String token) {
        log.debug("Finding user by auth token");
        return userRepository.findByAuthToken(token);
    }
    
    @Override
    public List<User> findByRole(String role) {
        log.debug("Finding users by role: {}", role);
        return userRepository.findByRole(role);
    }
    
    @Override
    public List<User> findByStatus(String status) {
        log.debug("Finding users by status: {}", status);
        return userRepository.findByStatus(status);
    }
    
    @Override
    public List<User> findActiveUsers() {
        log.debug("Finding all active users");
        return userRepository.findByActiveTrue();
    }
    
    @Override
    public boolean existsByUsername(String username) {
        return userRepository.existsByUsername(username);
    }
    
    @Override
    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }
    
    @Override
    @CacheEvict(value = "users", allEntries = true)
    public User register(UserDTO userDTO) {
        log.info("Registering new user: {}", userDTO.getUsername());
        
        // Validate unique constraints
        if (existsByUsername(userDTO.getUsername())) {
            throw new BusinessException("Username already exists", "DUPLICATE_USERNAME");
        }
        if (existsByEmail(userDTO.getEmail())) {
            throw new BusinessException("Email already exists", "DUPLICATE_EMAIL");
        }
        
        User user = mapper.toUserEntity(userDTO);
        user.setPassword(hashPassword(userDTO.getPassword()));
        user.setStatus("ACTIVE");
        if (user.getRole() == null) {
            user.setRole("VIEWER");
        }
        user.prePersist();
        
        User savedUser = userRepository.save(user);
        log.info("User registered successfully: {}", savedUser.getUsername());
        
        return savedUser;
    }
    
    @Override
    public String login(String username, String password) {
        log.info("User login attempt: {}", username);
        
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UnauthorizedException("Invalid credentials"));
        
        if (!user.getPassword().equals(hashPassword(password))) {
            throw new UnauthorizedException("Invalid credentials");
        }
        
        if (!"ACTIVE".equals(user.getStatus())) {
            throw new BusinessException("User account is not active", "INACTIVE_ACCOUNT");
        }
        
        // Generate simple auth token
        String token = generateAuthToken(username);
        user.setAuthToken(token);
        userRepository.save(user);
        
        log.info("User logged in successfully: {}", username);
        return token;
    }
    
    @Override
    @CacheEvict(value = "users", allEntries = true)
    public void logout(String token) {
        log.info("User logout with token");
        
        User user = userRepository.findByAuthToken(token)
                .orElseThrow(() -> new UnauthorizedException("Invalid token"));
        
        user.setAuthToken(null);
        userRepository.save(user);
        
        log.info("User logged out successfully: {}", user.getUsername());
    }
    
    @Override
    @CacheEvict(value = "users", allEntries = true)
    public User update(Long id, User entity) {
        log.debug("Updating user with id: {}", id);
        
        User existingUser = findByIdOrThrow(id);
        
        // Preserve certain fields
        entity.setId(id);
        entity.setCreatedAt(existingUser.getCreatedAt());
        entity.setAuthToken(existingUser.getAuthToken());
        if (entity.getPassword() == null) {
            entity.setPassword(existingUser.getPassword());
        } else {
            entity.setPassword(hashPassword(entity.getPassword()));
        }
        entity.preUpdate();
        
        return userRepository.save(entity);
    }
    
    @Override
    @CacheEvict(value = "users", allEntries = true)
    public User updateProfile(Long userId, UserDTO userDTO, String authToken) {
        log.info("Updating user profile for id: {}", userId);
        
        // Verify the token belongs to the user
        User authenticatedUser = userRepository.findByAuthToken(authToken)
                .orElseThrow(() -> new UnauthorizedException("Invalid token"));
        
        // Check if user is updating their own profile or is an admin
        if (!authenticatedUser.getId().equals(userId) && !"ADMIN".equals(authenticatedUser.getRole())) {
            throw new UnauthorizedException("You can only update your own profile");
        }
        
        User user = findByIdOrThrow(userId);
        
        // Update allowed fields
        if (userDTO.getEmail() != null && !userDTO.getEmail().equals(user.getEmail())) {
            if (existsByEmail(userDTO.getEmail())) {
                throw new BusinessException("Email already exists", "DUPLICATE_EMAIL");
            }
            user.setEmail(userDTO.getEmail());
        }
        
        if (userDTO.getFullName() != null) {
            user.setFullName(userDTO.getFullName());
        }
        
        if (userDTO.getPassword() != null) {
            user.setPassword(hashPassword(userDTO.getPassword()));
        }
        
        // Only admins can change roles and status
        if ("ADMIN".equals(authenticatedUser.getRole())) {
            if (userDTO.getRole() != null) {
                user.setRole(userDTO.getRole());
            }
            if (userDTO.getStatus() != null) {
                user.setStatus(userDTO.getStatus());
            }
        }
        
        user.preUpdate();
        User updatedUser = userRepository.save(user);
        
        log.info("User profile updated successfully: {}", updatedUser.getUsername());
        return updatedUser;
    }
    
    private String hashPassword(String password) {
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            byte[] hash = md.digest(password.getBytes(StandardCharsets.UTF_8));
            return Base64.getEncoder().encodeToString(hash);
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("Error hashing password", e);
        }
    }
    
    private String generateAuthToken(String username) {
        String tokenData = username + ":" + System.currentTimeMillis() + ":" + UUID.randomUUID();
        return Base64.getEncoder().encodeToString(tokenData.getBytes(StandardCharsets.UTF_8));
    }
}
