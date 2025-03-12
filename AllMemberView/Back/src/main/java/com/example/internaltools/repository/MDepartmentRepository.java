package com.example.internaltools.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.internaltools.entity.MDepartmentEntity;

public interface MDepartmentRepository extends JpaRepository<MDepartmentEntity, Integer> {
}
