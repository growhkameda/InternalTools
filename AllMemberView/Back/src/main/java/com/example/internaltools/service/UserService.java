package com.example.internaltools.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.internaltools.entity.UserEntity;
import com.example.internaltools.repository.UserRepository;

@Service
@Transactional
public class UserService {
	
	@Autowired
	private UserRepository repository;
	
	public List<UserEntity> getAllUsers() {
        return repository.findAll();
    }
	
	public UserEntity getUserById(Integer id) {
        return repository.findById(id).get();
    }
	
	// 部署 ID でユーザーを検索するメソッド
	public List<UserEntity> findUsersByDepartmentName(String departmentName) {
        return repository.findByDepartmentName(departmentName);
    }
}
