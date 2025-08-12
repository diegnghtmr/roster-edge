package co.edu.uniquindio.rosteredge.backend.controller;

import co.edu.uniquindio.rosteredge.backend.dto.ApiResponse;
import co.edu.uniquindio.rosteredge.backend.dto.UserDTO;
import co.edu.uniquindio.rosteredge.backend.exception.UnauthorizedException;
import co.edu.uniquindio.rosteredge.backend.mapper.EntityMapper;
import co.edu.uniquindio.rosteredge.backend.model.User;
import co.edu.uniquindio.rosteredge.backend.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
@Slf4j
public class UserController extends BaseController {
    
    private final UserService userService;
    private final EntityMapper mapper;
    
    @PostMapping("/register")
    public ResponseEntity<ApiResponse<UserDTO>> register(@Valid @RequestBody UserDTO userDTO) {
        log.info("Registering new user: {}", userDTO.getUsername());
        User user = userService.register(userDTO);
        UserDTO responseDTO = mapper.toUserDTO(user);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success(responseDTO, "User registered successfully"));
    }
    
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<Map<String, String>>> login(@RequestBody Map<String, String> credentials) {
        String username = credentials.get("username");
        String password = credentials.get("password");
        
        if (username == null || password == null) {
            throw new UnauthorizedException("Username and password are required");
        }
        
        log.info("Login attempt for user: {}", username);
        String token = userService.login(username, password);
        
        Map<String, String> response = Map.of(
            "token", token,
            "username", username
        );
        
        return ResponseEntity.ok(ApiResponse.success(response, "Login successful"));
    }
    
    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<Void>> logout(@RequestHeader("Authorization") String token) {
        log.info("Logout request");
        userService.logout(token);
        return ResponseEntity.ok(ApiResponse.success(null, "Logout successful"));
    }
    
    @GetMapping
    public ResponseEntity<ApiResponse<List<UserDTO>>> getAllUsers(
            @RequestHeader(value = "Authorization", required = false) String token) {
        
        // Verify admin authorization
        if (token != null) {
            User user = userService.findByAuthToken(token)
                    .orElseThrow(() -> new UnauthorizedException("Invalid token"));
            if (!"ADMIN".equals(user.getRole())) {
                throw new UnauthorizedException("Admin access required");
            }
        }
        
        List<User> users = userService.findAll();
        List<UserDTO> userDTOs = users.stream()
                .map(mapper::toUserDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.success(userDTOs));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<UserDTO>> getUserById(@PathVariable Long id) {
        User user = userService.findById(id)
                .orElseThrow(() -> new co.edu.uniquindio.rosteredge.backend.exception.EntityNotFoundException("User", id));
        UserDTO userDTO = mapper.toUserDTO(user);
        return ResponseEntity.ok(ApiResponse.success(userDTO));
    }
    
    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<UserDTO>> getProfile(@RequestHeader("Authorization") String token) {
        User user = userService.findByAuthToken(token)
                .orElseThrow(() -> new UnauthorizedException("Invalid token"));
        UserDTO userDTO = mapper.toUserDTO(user);
        return ResponseEntity.ok(ApiResponse.success(userDTO));
    }
    
    @PutMapping("/profile")
    public ResponseEntity<ApiResponse<UserDTO>> updateProfile(
            @RequestHeader("Authorization") String token,
            @Valid @RequestBody UserDTO userDTO) {
        
        User authenticatedUser = userService.findByAuthToken(token)
                .orElseThrow(() -> new UnauthorizedException("Invalid token"));
        
        User updatedUser = userService.updateProfile(authenticatedUser.getId(), userDTO, token);
        UserDTO responseDTO = mapper.toUserDTO(updatedUser);
        return ResponseEntity.ok(ApiResponse.success(responseDTO, "Profile updated successfully"));
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<UserDTO>> updateUser(
            @PathVariable Long id,
            @RequestHeader("Authorization") String token,
            @Valid @RequestBody UserDTO userDTO) {
        
        User updatedUser = userService.updateProfile(id, userDTO, token);
        UserDTO responseDTO = mapper.toUserDTO(updatedUser);
        return ResponseEntity.ok(ApiResponse.success(responseDTO, "User updated successfully"));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteUser(
            @PathVariable Long id,
            @RequestHeader("Authorization") String token) {
        
        // Verify admin authorization
        User user = userService.findByAuthToken(token)
                .orElseThrow(() -> new UnauthorizedException("Invalid token"));
        if (!"ADMIN".equals(user.getRole())) {
            throw new UnauthorizedException("Admin access required");
        }
        
        userService.deleteById(id);
        return ResponseEntity.ok(ApiResponse.success(null, "User deleted successfully"));
    }
    
    @GetMapping("/role/{role}")
    public ResponseEntity<ApiResponse<List<UserDTO>>> getUsersByRole(
            @PathVariable String role,
            @RequestHeader("Authorization") String token) {
        
        // Verify authorization
        User user = userService.findByAuthToken(token)
                .orElseThrow(() -> new UnauthorizedException("Invalid token"));
        
        List<User> users = userService.findByRole(role);
        List<UserDTO> userDTOs = users.stream()
                .map(mapper::toUserDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.success(userDTOs));
    }
}
