package com.example.internaltools.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.internaltools.entity.MPositionEntity;

public interface MPositionRepository extends JpaRepository<MPositionEntity, Integer> {
	
}