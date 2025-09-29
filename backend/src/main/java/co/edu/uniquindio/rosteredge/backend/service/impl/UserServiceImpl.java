package co.edu.uniquindio.rosteredge.backend.service.impl;

import co.edu.uniquindio.rosteredge.backend.dto.UserDTO;
import co.edu.uniquindio.rosteredge.backend.exception.BusinessException;
import co.edu.uniquindio.rosteredge.backend.mapper.EntityMapper;
import co.edu.uniquindio.rosteredge.backend.model.User;
import co.edu.uniquindio.rosteredge.backend.repository.UserRepository;
import co.edu.uniquindio.rosteredge.backend.service.AbstractBaseService;
import co.edu.uniquindio.rosteredge.backend.service.UserService;
import co.edu.uniquindio.rosteredge.backend.security.PasswordHasher;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
@Slf4j
public class UserServiceImpl extends AbstractBaseService<User, Long> implements UserService {

    private final UserRepository userRepository;
    private final EntityMapper mapper;
    private final PasswordHasher passwordHasher;

    public UserServiceImpl(UserRepository userRepository, EntityMapper mapper, PasswordHasher passwordHasher) {
        super(userRepository);
        this.userRepository = userRepository;
        this.mapper = mapper;
        this.passwordHasher = passwordHasher;
    }

    @Override
    protected String getEntityName() {
        return "User";
    }

    @Override
    public Optional<User> findByEmail(String email) {
        log.debug("Finding user by email: {}", email);
        return userRepository.findByEmail(email);
    }

    @Override
    public List<User> findActiveUsers() {
        log.debug("Finding all active users");
        return userRepository.findByActiveTrue();
    }

    @Override
    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    @Override
    public UserDTO register(UserDTO userDTO) {
        log.info("Registering user with email: {}", userDTO.getEmail());

        if (existsByEmail(userDTO.getEmail())) {
            throw new BusinessException("User with email " + userDTO.getEmail() + " already exists");
        }

        User user = mapper.toUserEntity(userDTO);
        user.setActive(true);
        if (userDTO.getPassword() != null) {
            user.setPasswordHash(passwordHasher.hash(userDTO.getPassword()));
        }

        User savedUser = save(user);
        return mapper.toUserDTO(savedUser);
    }

    @Override
    public List<UserDTO> findAllUsers() {
        log.info("Finding all users");
        return userRepository.findAll().stream()
                .map(mapper::toUserDTO)
                .toList();
    }

    @Override
    public UserDTO findUserById(Long id) {
        log.info("Finding user with id: {}", id);
        return userRepository.findById(id)
                .map(mapper::toUserDTO)
                .orElseThrow(() -> new co.edu.uniquindio.rosteredge.backend.exception.EntityNotFoundException(
                        getEntityName(), id));
    }


}


