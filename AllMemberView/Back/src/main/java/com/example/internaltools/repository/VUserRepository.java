package com.example.internaltools.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.internaltools.entity.VUserEntity;


public interface VUserRepository extends JpaRepository<VUserEntity, Integer> {
	 @Query("SELECT u FROM VUserEntity u WHERE FUNCTION('SUBSTRING_INDEX', u.birthDate, '/', 1) = :month")
	 List<VUserEntity> findUsersByBirthMonth(@Param("month") String month);
	 
	// フロントから受け取った入社年月(joiningMonth)から該当社員のデータをDBから取得する
	@Query("SELECT u FROM VUserEntity u WHERE u.joiningMonth = :joiningMonth")
	List<VUserEntity> findEmployeesByJoiningMonth(String joiningMonth);
}
