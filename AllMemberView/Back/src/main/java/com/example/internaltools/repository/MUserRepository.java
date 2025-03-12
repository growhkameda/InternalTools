package com.example.internaltools.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import com.example.internaltools.entity.MUserEntity;

public interface MUserRepository extends JpaRepository<MUserEntity, Integer> {
	// メールアドレスでユーザーを検索
	Optional<MUserEntity> findByEmail(String email);
	
	// ユーザIDでユーザ情報を検索
	Optional<MUserEntity> findById(Integer id);
	
	@Transactional
	@Modifying
	@Query("UPDATE MUserEntity mu SET mu.password = :password WHERE mu.id = :id")
	int updatePassword(@Param("password") String password, @Param("id") int id);
	
    @Modifying
    @Transactional
    @Query("DELETE FROM MUserEntity mu WHERE mu.id = :id")
    void deleteUser(@Param("id") Integer id);
}