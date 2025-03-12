package com.example.internaltools.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.internaltools.entity.VUserDepartmentEntity;
import com.example.internaltools.repository.VUserDepartmentRepository;

@Service
@Transactional
public class VUserDepartmentService {
	
	@Autowired
	private VUserDepartmentRepository vUserDepartmentRepository;
	
	public List<VUserDepartmentEntity> getAllUserDepartment() {
		return vUserDepartmentRepository.findAll();
	}
	
	// 部署 ID でユーザーを検索するメソッド
	public List<VUserDepartmentEntity> findUsersByDepartmentId(Integer departmentId) {
        return vUserDepartmentRepository.findByDepartmentId(departmentId);
    }
}
