package com.example.internaltools.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.internaltools.entity.UserEntity;

public interface UserRepository extends JpaRepository<UserEntity, Integer> {
    
	
    // 部署 ID に基づいてユーザー一覧を取得する
	List<UserEntity> findByDepartmentName(String departmentName);
}
