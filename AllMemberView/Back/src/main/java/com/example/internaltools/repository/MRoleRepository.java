package com.example.internaltools.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.internaltools.entity.MRoleEntity;

public interface MRoleRepository extends JpaRepository<MRoleEntity, Integer> {
	
}