package com.example.internaltools.repository;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.example.internaltools.entity.UserUpdateEntity;

@Repository
public interface UserUpdateRepository extends CrudRepository<UserUpdateEntity, Integer> {

    @Modifying
    @Transactional
    @Query("UPDATE UserUpdateEntity u SET u.userName = :userName, u.birthDate = :birthDate, u.hobby = :hobby, u.image = :image WHERE u.userId = :userId")
    void updateUser(@Param("userId") Integer userId, @Param("userName") String userName, @Param("birthDate") String birthDate, @Param("hobby") String hobby, @Param("image") String image);
    
    @Modifying
    @Transactional
    @Query("DELETE FROM UserUpdateEntity u WHERE u.userId = :userId")
    void deleteUser(@Param("userId") Integer userId);

}

