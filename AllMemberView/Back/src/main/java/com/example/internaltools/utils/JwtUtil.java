package com.example.internaltools.utils;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

import javax.crypto.SecretKey;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Component
public class JwtUtil {

    // volatileを付けて、マルチスレッド環境での可視性を保証する
    private volatile SecretKey SECRET_KEY;

    // キーを取得するための専用メソッドを用意し、スレッドセーフにする
    private SecretKey getSecretKey() {
        // Double-Checked Locking パターンで効率的に初期化
        SecretKey result = SECRET_KEY;
        if (result == null) {
            synchronized (this) {
                result = SECRET_KEY;
                if (result == null) {
                    SECRET_KEY = result = Keys.hmacShaKeyFor("secret".getBytes());
                }
            }
        }
        return result;
    }

    // トークンからユーザー名を取得
    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }
    
    // ユーザーIDを取得する
    public Integer extractUserId(String token) {
        Claims claims = extractAllClaims(token);
        return claims.get("userId", Integer.class);
    }

    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    private Claims extractAllClaims(String token) {
        // ★★★ SECRET_KEYを直接参照せず、getSecretKey()メソッド経由で取得する ★★★
        return Jwts.parser().verifyWith(getSecretKey()).build().parseSignedClaims(token).getPayload();
    }

    private Boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    // ユーザー名からトークンを生成
    public String generateToken(String userName, int userId, boolean isAdmin) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("userId", userId);
        claims.put("isAdmin", isAdmin);
        return createToken(claims, userName);
    }

    private String createToken(Map<String, Object> claims, String subject) {
        return Jwts.builder()
                .claims(claims)
                .subject(subject)
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 10))
                .signWith(getSecretKey())
                .compact();
    }

    // トークンの有効性を検証
    public Boolean validateToken(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }
}