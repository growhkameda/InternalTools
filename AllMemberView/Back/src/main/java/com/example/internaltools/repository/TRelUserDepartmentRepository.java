package com.example.internaltools.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import com.example.internaltools.entity.TRelUserDepartmentEntity;


public interface TRelUserDepartmentRepository extends JpaRepository<TRelUserDepartmentEntity, Integer> {
	// ユーザIDに紐づく部署情報を取得
	Optional<TRelUserDepartmentEntity> findByUserId(Integer userId);
	
	// ユーザIDに紐づく部署情報を削除
    @Modifying
    @Transactional
    @Query("DELETE FROM TRelUserDepartmentEntity tr WHERE tr.userId = :userId")
    void deleteUserDepartmentByUserId(@Param("userId") Integer id);
}
