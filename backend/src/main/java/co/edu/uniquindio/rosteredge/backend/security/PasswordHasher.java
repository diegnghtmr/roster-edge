package co.edu.uniquindio.rosteredge.backend.security;

import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Base64;

/**
 * Utility component to hash passwords using SHA-256 and compare hashes.
 */
@Component
public class PasswordHasher {

    private static final String ALGORITHM = "SHA-256";

    public String hash(String rawPassword) {
        if (rawPassword == null) {
            throw new IllegalArgumentException("Raw password must not be null");
        }
        return Base64.getEncoder().encodeToString(digest(rawPassword));
    }

    public boolean matches(String rawPassword, String encodedPassword) {
        if (encodedPassword == null) {
            return false;
        }
        String base64Hash = hash(rawPassword);
        if (base64Hash.equals(encodedPassword)) {
            return true;
        }
        return hashHex(rawPassword).equalsIgnoreCase(encodedPassword);
    }

    private String hashHex(String rawPassword) {
        byte[] digest = digest(rawPassword);
        StringBuilder hex = new StringBuilder(digest.length * 2);
        for (byte b : digest) {
            hex.append(String.format("%02x", b));
        }
        return hex.toString();
    }

    private byte[] digest(String rawPassword) {
        try {
            MessageDigest digest = MessageDigest.getInstance(ALGORITHM);
            return digest.digest(rawPassword.getBytes(StandardCharsets.UTF_8));
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException("SHA-256 algorithm not available", e);
        }
    }
}
