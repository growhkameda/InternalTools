package com.example.internaltools.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.example.internaltools.entity.UserPasswordInfo;

@Repository
public interface PasswordChangeRepository extends JpaRepository<UserPasswordInfo, Integer> {
 
    // ID と パスワードでユーザーを検索
	UserPasswordInfo findById(int id);
	
	@Transactional
	@Modifying
	@Query("UPDATE LoginUser lu SET lu.password = :password WHERE lu.id = :id")
	int updatePassword(@Param("password") String password, @Param("id") int id);
}
