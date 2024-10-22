package com.example.internaltools.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.internaltools.entity.LoginUser;

public interface LoginUserRepository extends JpaRepository<LoginUser, Integer> {
	Optional<LoginUser> findByEmail(String email);  // メールアドレスでユーザーを検索
}