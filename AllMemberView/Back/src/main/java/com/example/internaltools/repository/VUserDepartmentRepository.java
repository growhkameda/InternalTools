package com.example.internaltools.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.internaltools.entity.VUserDepartmentEntity;
import com.example.internaltools.expansion.UserDepartmentId;


public interface VUserDepartmentRepository extends JpaRepository<VUserDepartmentEntity, UserDepartmentId> {
    // 部署 ID に基づいてユーザー一覧を取得する
	List<VUserDepartmentEntity> findByDepartmentId(Integer departmentId);
}
