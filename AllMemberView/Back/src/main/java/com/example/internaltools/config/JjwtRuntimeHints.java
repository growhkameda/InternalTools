package com.example.internaltools.config;

import java.util.stream.Stream;

import org.springframework.aot.hint.MemberCategory;
import org.springframework.aot.hint.RuntimeHints;
import org.springframework.aot.hint.RuntimeHintsRegistrar;
import org.springframework.aot.hint.TypeReference;

// AOTビルドのためのヒントを追加
public class JjwtRuntimeHints implements RuntimeHintsRegistrar {

    @Override
    public void registerHints(RuntimeHints hints, ClassLoader classLoader) {
        // --- 1. JWT関連のヒント (ログイン処理に必要) ---
        Stream.of(
            "io.jsonwebtoken.Jwts$SIG",
            "io.jsonwebtoken.impl.security.StandardSecureDigestAlgorithms",
            "io.jsonwebtoken.impl.security.StandardKeyOperations",
            "io.jsonwebtoken.impl.DefaultJweHeader",
            "io.jsonwebtoken.impl.DefaultJwtBuilder",
            "io.jsonwebtoken.impl.DefaultClaimsBuilder",
            "io.jsonwebtoken.impl.DefaultJwsHeader",
            "io.jsonwebtoken.impl.DefaultHeader",
            "io.jsonwebtoken.impl.DefaultProtectedHeader",
            "io.jsonwebtoken.impl.io.StandardCompressionAlgorithms",
            "io.jsonwebtoken.impl.security.StandardEncryptionAlgorithms",
            "io.jsonwebtoken.impl.security.StandardKeyAlgorithms",
            "io.jsonwebtoken.impl.DefaultJwtParserBuilder",
            "io.jsonwebtoken.jackson.io.JacksonDeserializer",
            "io.jsonwebtoken.jackson.io.JacksonSerializer",
            "io.jsonwebtoken.impl.DefaultClaims",
            "io.jsonwebtoken.impl.ParameterMap",
            "io.jsonwebtoken.security.Keys",
            "io.jsonwebtoken.impl.security.KeysBridge"
        ).map(TypeReference::of).forEach(type ->
            // JWT関連はコンストラクタへのアクセス許可で十分な場合が多いです
            hints.reflection().registerType(type, MemberCategory.INVOKE_DECLARED_CONSTRUCTORS)
        );

        // JJWTが利用するサービスファイルをリソースとして登録
        hints.resources().registerPattern("META-INF/services/io.jsonwebtoken.io.Deserializer");
        hints.resources().registerPattern("META-INF/services/io.jsonwebtoken.io.Serializer");

        
        // --- 2. Jackson関連のヒント (APIレスポンスのJSON変換に必要) ---
        Stream.of(
            // DTO (Data Transfer Objects)
            "com.example.internaltools.dto.DtoAuthRequest",
            "com.example.internaltools.dto.DtoAuthResponse",
            "com.example.internaltools.dto.DtoDepartmentRequest",
            "com.example.internaltools.dto.DtoNewDepartmentPosition",
            "com.example.internaltools.dto.DtoNewUser",
            "com.example.internaltools.dto.DtoPasswordInfo",
            "com.example.internaltools.dto.DtoUserDepartment",

            // Entities (データベースのテーブルに対応するクラス)
            "com.example.internaltools.entity.MDepartmentEntity",
            "com.example.internaltools.entity.MPositionEntity",
            "com.example.internaltools.entity.MRoleEntity",
            "com.example.internaltools.entity.MUserEntity",
            "com.example.internaltools.entity.TRelUserDepartmentEntity",
            "com.example.internaltools.entity.TUserEntity",
            "com.example.internaltools.entity.VUserDepartmentEntity",
            "com.example.internaltools.entity.VUserEntity",

            // 複合主キーのためのクラス
            "com.example.internaltools.expansion.UserDepartmentId"
            
        ).map(TypeReference::of).forEach(type ->
            // Jacksonはgetter/setter/フィールドなど全てにアクセスするため、全メンバーへのリフレクションを許可します
            hints.reflection().registerType(type, MemberCategory.values())
        );
    }
}