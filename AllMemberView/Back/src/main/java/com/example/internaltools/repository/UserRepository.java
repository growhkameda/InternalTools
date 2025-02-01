package com.example.internaltools.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.internaltools.entity.UserEntity;


public interface UserRepository extends JpaRepository<UserEntity, Integer> {
    
}
