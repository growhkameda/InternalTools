package com.example.internaltools.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;

import com.example.internaltools.entity.AuthRequest;
import com.example.internaltools.entity.LoginUser;
import com.example.internaltools.utils.JwtUtil;

@Service
public class AuthService {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserDetailsService userDetailsService;

    public String login(AuthRequest authRequest) {
        try {
            // 認証を試みる
            authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(authRequest.getEmail(), authRequest.getPassword())
            );

            // LoginUserを取得
            LoginUser loginUser = (LoginUser) userDetailsService.loadUserByUsername(authRequest.getEmail());
            Integer userId = loginUser.getId();  // ユーザーIDを取得

            // ユーザー名とユーザーIDでトークンを生成
            final String token = jwtUtil.generateToken(authRequest.getEmail(), userId);
            return token;
        } catch (Exception e) {
            throw new RuntimeException("Invalid credentials"); // 認証失敗時のエラーメッセージ
        }
    }

}
