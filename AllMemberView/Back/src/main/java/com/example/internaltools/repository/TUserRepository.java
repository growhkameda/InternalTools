package com.example.internaltools.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.example.internaltools.entity.TUserEntity;

@Repository
public interface TUserRepository extends JpaRepository<TUserEntity, Integer> {
	
	Optional<TUserEntity> findByUserId(Integer userId);

    @Modifying
    @Transactional
    @Query("UPDATE TUserEntity u SET u.userName = :userName, u.birthDate = :birthDate, u.hobby = :hobby, u.image = :image , u.joiningMonth = :joiningMonth, u.ruby = :ruby WHERE u.userId = :userId")
    void updateUser(@Param("userId") Integer userId, @Param("userName") String userName, @Param("birthDate") String birthDate, @Param("hobby") String hobby, @Param("image") String image, @Param("joiningMonth") String joiningMonth, @Param("ruby") String ruby, @Param("mbti") String mbti);
    
    @Modifying
    @Transactional
    @Query("DELETE FROM TUserEntity u WHERE u.userId = :userId")
    void deleteUser(@Param("userId") Integer userId);

}
