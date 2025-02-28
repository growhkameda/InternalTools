package com.example.internaltools.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.internaltools.entity.UserEntity;


public interface UserRepository extends JpaRepository<UserEntity, Integer> {
    @Query("SELECT u FROM UserEntity u WHERE FUNCTION('SUBSTRING_INDEX', u.birthDate, '/', 1) = :month")
    List<UserEntity> findUsersByBirthMonth(@Param("month") String month);
}
