package com.example.internaltools.config;

import java.util.List; // Listをインポート
import java.util.stream.Stream;

import org.springframework.aot.hint.MemberCategory;
import org.springframework.aot.hint.RuntimeHints;
import org.springframework.aot.hint.RuntimeHintsRegistrar;
import org.springframework.aot.hint.TypeReference;

public class JjwtRuntimeHints implements RuntimeHintsRegistrar {

    @Override
    public void registerHints(RuntimeHints hints, ClassLoader classLoader) {
        // JSONファイルから特定されたJJWT関連のクラスをすべて登録
        List<TypeReference> reflectionTypes = Stream.of(
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
        ).map(TypeReference::of).toList(); // .toList() を追加してStreamをListに変換

        // 上記リストの各クラスに対し、コンストラクタ、メソッド、フィールドへのアクセスを許可
        hints.reflection().registerTypes(reflectionTypes,
            hint -> hint.withMembers(
                MemberCategory.INVOKE_DECLARED_CONSTRUCTORS,
                MemberCategory.INVOKE_DECLARED_METHODS,
                MemberCategory.DECLARED_FIELDS
            )
        );

        // JJWTが利用するサービスファイルをリソースとして登録
        hints.resources().registerPattern("META-INF/services/io.jsonwebtoken.io.Deserializer");
        hints.resources().registerPattern("META-INF/services/io.jsonwebtoken.io.Serializer");
    }
}