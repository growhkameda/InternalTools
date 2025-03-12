package com.example.internaltools.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.internaltools.repository.TRelUserDepartmentRepository;

@Service
@Transactional
public class TRelUserDepartmentService {
	
	@Autowired
	private TRelUserDepartmentRepository tRelUserDepartmentRepository;
	
	// ユーザIDに紐づく部署からユーザIDのユーザ情報を削除
	public void deleteUserDepartment(Integer userId) {
		tRelUserDepartmentRepository.deleteUserDepartmentByUserId(userId);
    }
}
