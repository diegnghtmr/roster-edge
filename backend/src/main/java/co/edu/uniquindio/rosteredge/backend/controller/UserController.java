package co.edu.uniquindio.rosteredge.backend.controller;

import co.edu.uniquindio.rosteredge.backend.dto.ApiResponse;
import co.edu.uniquindio.rosteredge.backend.dto.UserDTO;

import co.edu.uniquindio.rosteredge.backend.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
@Slf4j
public class UserController extends BaseController {

    private final UserService userService;

    @GetMapping("/")
    public ResponseEntity<ApiResponse<List<UserDTO>>> getAllUsers(
            @RequestParam(required = false) Long cityId,
            @RequestParam(required = false) Boolean active,
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String email) {
        Boolean effectiveActive = resolveActive(active);
        log.info("Request to get users with filters - cityId: {}, active: {}, name: {}, email: {}",
                cityId, effectiveActive, name, email);
        List<UserDTO> users = userService.findAllUsers(cityId, effectiveActive, name, email);
        return ResponseEntity.ok(ApiResponse.success(users));
    }

    @GetMapping("/{id}/")
    public ResponseEntity<ApiResponse<UserDTO>> getUserById(@PathVariable Long id) {
        log.info("Request to get user by id: {}", id);
        UserDTO user = userService.findUserById(id);
        return ResponseEntity.ok(ApiResponse.success(user));
    }

    @PostMapping("/register/")
    public ResponseEntity<ApiResponse<UserDTO>> register(@Valid @RequestBody UserDTO userDTO) {
        log.info("Registering new user: {}", userDTO.getName());
        UserDTO responseDTO = userService.register(userDTO);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success(responseDTO, "User registered successfully"));
    }

    // @PostMapping("/login")
    // public ResponseEntity<ApiResponse<Map<String, String>>> login(@RequestBody
    // Map<String, String> credentials) {
    // String username = credentials.get("username");
    // String password = credentials.get("password");

    // if (username == null || password == null) {
    // throw new UnauthorizedException("Username and password are required");
    // }

    // log.info("Login attempt for user: {}", username);
    // String token = userService.login(username, password);

    // Map<String, String> response = Map.of(
    // "token", token,
    // "username", username
    // );

    // return ResponseEntity.ok(ApiResponse.success(response, "Login successful"));
    // }

    // @PostMapping("/logout")
    // public ResponseEntity<ApiResponse<Void>>
    // logout(@RequestHeader("Authorization") String token) {
    // log.info("Logout request");
    // userService.logout(token);
    // return ResponseEntity.ok(ApiResponse.success(null, "Logout successful"));
    // }

    // @GetMapping("/{id}")
    // public ResponseEntity<ApiResponse<UserDTO>> getUserById(@PathVariable Long
    // id) {
    // User user = userService.findById(id)
    // .orElseThrow(() -> new
    // co.edu.uniquindio.rosteredge.backend.exception.EntityNotFoundException("User",
    // id));
    // UserDTO userDTO = mapper.toUserDTO(user);
    // return ResponseEntity.ok(ApiResponse.success(userDTO));
    // }

    // @PutMapping("/{id}")
    // public ResponseEntity<ApiResponse<UserDTO>> updateUser(
    // @PathVariable Long id,
    // @RequestHeader("Authorization") String token,
    // @Valid @RequestBody UserDTO userDTO) {

    // User updatedUser = userService.updateProfile(id, userDTO, token);
    // UserDTO responseDTO = mapper.toUserDTO(updatedUser);
    // return ResponseEntity.ok(ApiResponse.success(responseDTO, "User updated
    // successfully"));
    // }

}
