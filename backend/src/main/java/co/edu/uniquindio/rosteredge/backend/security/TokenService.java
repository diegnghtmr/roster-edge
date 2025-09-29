package co.edu.uniquindio.rosteredge.backend.security;

import co.edu.uniquindio.rosteredge.backend.exception.UnauthorizedException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Base64;

/**
 * Minimal JWT-like token generator using HMAC-SHA256 that can also validate and decode tokens.
 */
@Component
public class TokenService {

    private static final String HMAC_ALGORITHM = "HmacSHA256";

    private final byte[] secret;
    private final long expirationSeconds;

    public TokenService(
            @Value("${security.token.secret:change-me}") String secret,
            @Value("${security.token.expiration:3600}") long expirationSeconds) {
        this.secret = secret.getBytes(StandardCharsets.UTF_8);
        this.expirationSeconds = expirationSeconds;
    }

    /**
     * Generate a signed token for the given subject, returning token metadata for downstream use.
     */
    public TokenDetails generateToken(String subject) {
        long issuedAt = Instant.now().getEpochSecond();
        long expiresAt = issuedAt + expirationSeconds;

        String headerJson = "{\"alg\":\"HS256\",\"typ\":\"JWT\"}";
        String payloadJson = String.format(
                "{\"sub\":\"%s\",\"iat\":%d,\"exp\":%d}",
                escape(subject), issuedAt, expiresAt);

        String header = base64UrlEncode(headerJson.getBytes(StandardCharsets.UTF_8));
        String payload = base64UrlEncode(payloadJson.getBytes(StandardCharsets.UTF_8));
        String signature = sign(header + "." + payload);

        String token = String.join(".", header, payload, signature);
        return new TokenDetails(token, subject, issuedAt, expiresAt);
    }

    /**
     * Validate token signature and expiration, returning its decoded claims.
     */
    public TokenDetails validateToken(String token) {
        TokenDetails details = parseToken(token);
        long now = Instant.now().getEpochSecond();
        if (details.expiresAt() < now) {
            throw new UnauthorizedException("Token expired");
        }
        return details;
    }

    /**
     * Decode token without checking expiration (useful right after issuing a token).
     */
    public TokenDetails parseToken(String token) {
        if (token == null || token.isBlank()) {
            throw new UnauthorizedException("Token is required");
        }

        String[] parts = token.split("\\.");
        if (parts.length != 3) {
            throw new UnauthorizedException("Invalid token format");
        }

        String unsigned = parts[0] + "." + parts[1];
        String expectedSignature = sign(unsigned);
        if (!constantTimeEquals(expectedSignature, parts[2])) {
            throw new UnauthorizedException("Invalid token signature");
        }

        String payloadJson = new String(Base64.getUrlDecoder().decode(parts[1]), StandardCharsets.UTF_8);
        String subject = extractStringClaim(payloadJson, "sub");
        long issuedAt = extractLongClaim(payloadJson, "iat");
        long expiresAt = extractLongClaim(payloadJson, "exp");

        return new TokenDetails(token, subject, issuedAt, expiresAt);
    }

    private String sign(String data) {
        try {
            Mac mac = Mac.getInstance(HMAC_ALGORITHM);
            mac.init(new SecretKeySpec(secret, HMAC_ALGORITHM));
            byte[] signatureBytes = mac.doFinal(data.getBytes(StandardCharsets.UTF_8));
            return base64UrlEncode(signatureBytes);
        } catch (Exception e) {
            throw new IllegalStateException("Unable to sign token", e);
        }
    }

    private static boolean constantTimeEquals(String expected, String actual) {
        if (expected.length() != actual.length()) {
            return false;
        }
        int result = 0;
        for (int i = 0; i < expected.length(); i++) {
            result |= expected.charAt(i) ^ actual.charAt(i);
        }
        return result == 0;
    }

    private static String base64UrlEncode(byte[] input) {
        return Base64.getUrlEncoder().withoutPadding().encodeToString(input);
    }

    private static String escape(String value) {
        return value.replace("\\", "\\\\").replace("\"", "\\\"");
    }

    private static String extractStringClaim(String json, String field) {
        String pattern = String.format("\"%s\":\"", field);
        int start = json.indexOf(pattern);
        if (start < 0) {
            throw new UnauthorizedException("Missing claim: " + field);
        }
        start += pattern.length();
        int end = json.indexOf('"', start);
        if (end < 0) {
            throw new UnauthorizedException("Invalid claim: " + field);
        }
        return json.substring(start, end);
    }

    private static long extractLongClaim(String json, String field) {
        String pattern = String.format("\"%s\":", field);
        int start = json.indexOf(pattern);
        if (start < 0) {
            throw new UnauthorizedException("Missing claim: " + field);
        }
        start += pattern.length();
        int end = json.indexOf(',', start);
        if (end < 0) {
            end = json.indexOf('}', start);
        }
        if (end < 0) {
            throw new UnauthorizedException("Invalid claim: " + field);
        }
        String value = json.substring(start, end).trim();
        try {
            return Long.parseLong(value);
        } catch (NumberFormatException ex) {
            throw new UnauthorizedException("Invalid numeric claim: " + field);
        }
    }

    public record TokenDetails(String token, String subject, long issuedAt, long expiresAt) {
    }
}
