package com.example.internaltools.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.internaltools.entity.UserDepartmentEntity;


public interface UserDepartmentRepository extends JpaRepository<UserDepartmentEntity, Integer> {
    
	
    // 部署 ID に基づいてユーザー一覧を取得する
	List<UserDepartmentEntity> findByDepartmentId(Integer departmentId);
}
