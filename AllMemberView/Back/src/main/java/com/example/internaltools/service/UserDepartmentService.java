package com.example.internaltools.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.internaltools.entity.UserDepartmentEntity;
import com.example.internaltools.repository.UserDepartmentRepository;
import com.example.internaltools.repository.UserRepository;

@Service
@Transactional
public class UserDepartmentService {
        
    @Autowired
    private UserDepartmentRepository userDepartmentRepository;

    @Autowired
    private UserRepository userRepository;
    
    // すべてのユーザー部署情報を取得するメソッドを追加
    public List<UserDepartmentEntity> getAllUserDepartment() {
        return userDepartmentRepository.findAll();
    }
        
//    // ユーザーIDでユーザー情報と部署情報を取得する
//    public UserEntity getUserDetails(Integer userId) {
//        UserEntity user = userRepository.findById(userId).orElse(null);
//        if (user == null) {
//            return null;// ユーザーが存在しない場合
//        }

//        // ユーザーに紐づく部署情報を取得
//        List<UserDepartmentEntity> departments = userDepartmentRepository.findByUser_UserId(userId);
//        user.setDepartments(departments); // ユーザーエンティティに部署情報をセット
//
//        return user;
//    }
    
    // 部署 ID でユーザー情報を取得するメソッドを追加
    public List<UserDepartmentEntity> findByDepartmentId(Integer departmentId) {
        return userDepartmentRepository.findByDepartmentId(departmentId);
    }
}
