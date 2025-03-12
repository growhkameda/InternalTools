package com.example.internaltools.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.internaltools.entity.MDepartmentEntity;
import com.example.internaltools.repository.MDepartmentRepository;

@Service
@Transactional
public class MDepartmentService {
    
    @Autowired
    private MDepartmentRepository departmentRepository; // DepartmentEntity用のリポジトリ

    public List<MDepartmentEntity> getDepartment() {

        return departmentRepository.findAll();
    }
}
