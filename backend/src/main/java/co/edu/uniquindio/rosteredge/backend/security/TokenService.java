package co.edu.uniquindio.rosteredge.backend.security;

import co.edu.uniquindio.rosteredge.backend.exception.UnauthorizedException;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.security.GeneralSecurityException;
import java.security.MessageDigest;
import java.security.SecureRandom;
import java.time.Instant;
import java.util.Arrays;
import java.util.Base64;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

@Component
public class TokenService {

    private static final String HMAC_ALGORITHM = "HmacSHA256";
    private static final int KEY_BYTES = 32;
    private static final Set<String> LOCAL_PROFILES = Set.of("dev", "test");
    private static final String HEADER = encode("{\"alg\":\"HS256\",\"typ\":\"JWT\"}".getBytes(StandardCharsets.UTF_8));
    private final ObjectMapper json = new ObjectMapper();
    private final byte[] secret;
    private final long expirationSeconds;

    public TokenService(@Value("${security.token.secret:}") String configuredSecret,
                        @Value("${security.token.expiration:3600}") long expirationSeconds,
                        Environment environment) {
        byte[] configuredKey = configuredSecret.getBytes(StandardCharsets.UTF_8);
        String[] profiles = environment.getActiveProfiles();
        if (configuredSecret.isEmpty() && profiles.length > 0 && Arrays.stream(profiles).allMatch(LOCAL_PROFILES::contains)) {
            configuredKey = new byte[KEY_BYTES];
            new SecureRandom().nextBytes(configuredKey);
        } else if (configuredKey.length < KEY_BYTES || configuredSecret.chars().distinct().count() < 12) {
            throw new IllegalArgumentException("security.token.secret must be a random signing secret of at least 32 bytes");
        }
        if (expirationSeconds <= 0) {
            throw new IllegalArgumentException("security.token.expiration must be positive");
        }
        this.secret = configuredKey;
        this.expirationSeconds = expirationSeconds;
    }

    public TokenDetails generateToken(String subject) {
        long issuedAt = Instant.now().getEpochSecond();
        long expiresAt = Math.addExact(issuedAt, expirationSeconds);
        try {
            String payload = encode(json.writeValueAsBytes(Map.of(
                    "sub", subject, "iat", issuedAt, "exp", expiresAt, "jti", UUID.randomUUID().toString())));
            String signed = HEADER + "." + payload;
            return new TokenDetails(signed + "." + encode(sign(signed)), subject, issuedAt, expiresAt);
        } catch (JsonProcessingException ex) {
            throw new IllegalStateException("Unable to encode token claims", ex);
        }
    }

    public TokenDetails validateToken(String token) {
        TokenDetails details = parseToken(token);
        if (details.expiresAt() <= Instant.now().getEpochSecond()) {
            throw new UnauthorizedException("Token expired");
        }
        return details;
    }

    public TokenDetails parseToken(String token) {
        if (token == null || token.length() > 4096) {
            throw new UnauthorizedException("Invalid token format");
        }
        String[] parts = token.split("\\.", -1);
        if (parts.length != 3 || !HEADER.equals(parts[0])) {
            throw new UnauthorizedException("Invalid token format");
        }
        try {
            var decoder = Base64.getUrlDecoder();
            if (!MessageDigest.isEqual(sign(parts[0] + "." + parts[1]), decoder.decode(parts[2]))) {
                throw new UnauthorizedException("Invalid token signature");
            }
            var claims = json.readTree(decoder.decode(parts[1]));
            var subject = claims.path("sub");
            var issuedAt = claims.path("iat");
            var expiresAt = claims.path("exp");
            if (!subject.isTextual() || subject.asText().isBlank() || !issuedAt.isIntegralNumber()
                    || !expiresAt.isIntegralNumber() || expiresAt.asLong() <= issuedAt.asLong()) {
                throw new UnauthorizedException("Invalid token claims");
            }
            return new TokenDetails(token, subject.asText(), issuedAt.asLong(), expiresAt.asLong());
        } catch (IOException | IllegalArgumentException ex) {
            throw new UnauthorizedException("Invalid token format");
        }
    }

    private byte[] sign(String data) {
        try {
            Mac mac = Mac.getInstance(HMAC_ALGORITHM);
            mac.init(new SecretKeySpec(secret, HMAC_ALGORITHM));
            return mac.doFinal(data.getBytes(StandardCharsets.UTF_8));
        } catch (GeneralSecurityException ex) {
            throw new IllegalStateException("Unable to sign token", ex);
        }
    }

    private static String encode(byte[] input) {
        return Base64.getUrlEncoder().withoutPadding().encodeToString(input);
    }

    public record TokenDetails(String token, String subject, long issuedAt, long expiresAt) { }
}
