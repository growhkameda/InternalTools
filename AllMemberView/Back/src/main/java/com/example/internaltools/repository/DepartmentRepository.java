package com.example.internaltools.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.internaltools.entity.DepartmentEntity;

public interface DepartmentRepository extends JpaRepository<DepartmentEntity, Integer> {
}
