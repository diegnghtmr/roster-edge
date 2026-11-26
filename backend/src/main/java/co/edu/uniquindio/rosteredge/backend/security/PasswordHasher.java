package co.edu.uniquindio.rosteredge.backend.security;

import org.springframework.stereotype.Component;

import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.PBEKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.GeneralSecurityException;
import java.security.MessageDigest;
import java.security.SecureRandom;
import java.util.Arrays;
import java.util.Base64;
import java.util.HexFormat;

@Component
public class PasswordHasher {

    private static final String FORMAT = "pbkdf2-sha256";
    private static final int WORK_FACTOR = 600_000;
    private static final int MAX_WORK_FACTOR = 2_000_000;
    private static final int SALT_BYTES = 16;
    private static final int HASH_BYTES = 32;
    private final SecureRandom random = new SecureRandom();

    public String hash(String rawPassword) {
        byte[] salt = new byte[SALT_BYTES];
        random.nextBytes(salt);
        return FORMAT + "$" + WORK_FACTOR + "$" + encode(salt) + "$"
                + encode(derive(rawPassword, salt, WORK_FACTOR));
    }

    public boolean matches(String rawPassword, String encodedPassword) {
        if (rawPassword == null || encodedPassword == null) {
            return false;
        }
        try {
            if (encodedPassword.startsWith(FORMAT + "$")) {
                String[] fields = encodedPassword.split("\\$", -1);
                if (fields.length != 4) {
                    return false;
                }
                int iterations = Integer.parseInt(fields[1]);
                byte[] salt = Base64.getDecoder().decode(fields[2]);
                byte[] expected = Base64.getDecoder().decode(fields[3]);
                return iterations > 0 && iterations <= MAX_WORK_FACTOR && salt.length >= SALT_BYTES
                        && expected.length == HASH_BYTES
                        && MessageDigest.isEqual(expected, derive(rawPassword, salt, iterations));
            }
            byte[] expected = encodedPassword.length() == 2 * HASH_BYTES
                    ? HexFormat.of().parseHex(encodedPassword) : Base64.getDecoder().decode(encodedPassword);
            return expected.length == HASH_BYTES && MessageDigest.isEqual(expected,
                    MessageDigest.getInstance("SHA-256").digest(rawPassword.getBytes(StandardCharsets.UTF_8)));
        } catch (IllegalArgumentException malformedHash) {
            return false;
        } catch (GeneralSecurityException unavailableAlgorithm) {
            throw new IllegalStateException("Password verification unavailable", unavailableAlgorithm);
        }
    }

    // Called only after a successful match so the format and work factor have been validated.
    public boolean needsRehash(String matchedHash) {
        return !matchedHash.startsWith(FORMAT + "$")
                || Integer.parseInt(matchedHash.split("\\$", -1)[1]) < WORK_FACTOR;
    }

    private static String encode(byte[] bytes) {
        return Base64.getEncoder().withoutPadding().encodeToString(bytes);
    }

    private static byte[] derive(String raw, byte[] salt, int iterations) {
        char[] characters = raw.toCharArray();
        PBEKeySpec spec = new PBEKeySpec(characters, salt, iterations, HASH_BYTES * Byte.SIZE);
        Arrays.fill(characters, '\0');
        try {
            return SecretKeyFactory.getInstance("PBKDF2WithHmacSHA256").generateSecret(spec).getEncoded();
        } catch (GeneralSecurityException ex) {
            throw new IllegalStateException("Password derivation unavailable", ex);
        } finally {
            spec.clearPassword();
        }
    }
}
