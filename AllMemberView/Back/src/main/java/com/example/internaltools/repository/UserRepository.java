package com.example.internaltools.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.example.internaltools.entity.UserEntity;

@Repository
public interface UserRepository extends JpaRepository<UserEntity, Integer> {
    
	//フロントから受け取った入社年月(joiningMonth)から該当社員をDBから取得する
	@Query("SELECT u FROM UserEntity u WHERE u.joiningMonth = :joiningMonth")
	List<UserEntity> findEmployeesByJoiningMonth(String joiningMonth);
}

