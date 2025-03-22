package com.example.internaltools.config;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.example.internaltools.filter.JwtAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {
	
    @Autowired
    private UserDetailsService userDetailsService;  // UserDetailsService を Autowire
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    String envType = System.getenv("ENV_TYPE");

    @Bean
    protected SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())  // CSRFを無効化
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/login").permitAll()  // 認証不要のエンドポイント
                .requestMatchers("/api/alluserinfo").authenticated()  // 認証が必要なエンドポイント
                .anyRequest().authenticated()  // 他のエンドポイントは認証が必要
            )
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)  // セッションをステートレスに
            )
            .addFilterBefore(jwtAuthenticationFilter(), UsernamePasswordAuthenticationFilter.class); // フィルターを追加;

        	http.cors(cors -> cors.configurationSource(corsConfigurationSource()));
        
        return http.build();
    }
    
    @Bean
    protected AuthenticationManager authenticationManager(HttpSecurity http) throws Exception {
        AuthenticationManagerBuilder authenticationManagerBuilder = 
            http.getSharedObject(AuthenticationManagerBuilder.class);
        
        authenticationManagerBuilder
        .userDetailsService(userDetailsService)
        .passwordEncoder(passwordEncoder);  // PasswordEncoder を設定

        return authenticationManagerBuilder.build();
    }
        
    @Bean
    protected JwtAuthenticationFilter jwtAuthenticationFilter() {
        return new JwtAuthenticationFilter(); // JWTフィルターを定義
    }
    
    @Bean
    protected CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of( "http://localhost:3000/","http://grow-navi.gc-systems.com/","https://grow-navi.gc-systems.com/")); // 許可するオリジン
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS")); // 許可するメソッド
        configuration.setAllowedHeaders(List.of("Authorization", "Content-Type")); // 許可するヘッダー
        configuration.setAllowCredentials(true); // 認証情報を含むリクエストを許可

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration); // 全エンドポイントに適用

        return source;
    }
}
