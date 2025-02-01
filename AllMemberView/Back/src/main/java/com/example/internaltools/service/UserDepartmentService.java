package com.example.internaltools.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.internaltools.entity.UserDepartmentEntity;
import com.example.internaltools.repository.UserDepartmentRepository;

@Service
@Transactional
public class UserDepartmentService {
	
	@Autowired
	private UserDepartmentRepository repository;
	
	public List<UserDepartmentEntity> getAllUserDepartment() {
		return repository.findAll();
	}
	
	// 部署 ID でユーザーを検索するメソッド
	public List<UserDepartmentEntity> findUsersByDepartmentId(Integer departmentId) {
        return repository.findByDepartmentId(departmentId);
    }
}
