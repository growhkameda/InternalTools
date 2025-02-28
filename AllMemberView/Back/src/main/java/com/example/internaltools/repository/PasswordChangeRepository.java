package com.example.internaltools.repository;

import org.springframework.data.jdbc.repository.query.Modifying;
import org.springframework.data.jdbc.repository.query.Query;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.internaltools.entity.LoginUser;
import com.example.internaltools.entity.UserPasswordInfo;

@Repository
public interface PasswordChangeRepository extends JpaRepository<LoginUser, Integer> {
 
    // ID と パスワードでユーザーを検索
	UserPasswordInfo findById(int id);
	
	@Modifying
	@Query("UPDATE LoginUser lu SET lu.password = :password WHERE lu.id = :id")
	void updatePassword(@Param("password") String password, @Param("id") int id);
}
