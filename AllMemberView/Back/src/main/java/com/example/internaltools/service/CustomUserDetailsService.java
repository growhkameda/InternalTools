package com.example.internaltools.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.example.internaltools.entity.LoginUser;
import com.example.internaltools.repository.LoginUserRepository;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private LoginUserRepository userRepository;  // LoginUserを扱うリポジトリ

    @Override
    public LoginUser loadUserByUsername(String username) throws UsernameNotFoundException {
        LoginUser user = userRepository.findByEmail(username).get(); // メールでユーザーを検索
        if (user == null) {
            throw new UsernameNotFoundException("User not found");
        }
        return user;  // LoginUser を返す
    }
}
