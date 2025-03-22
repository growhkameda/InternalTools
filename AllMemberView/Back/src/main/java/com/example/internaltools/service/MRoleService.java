package com.example.internaltools.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.internaltools.entity.MRoleEntity;
import com.example.internaltools.repository.MRoleRepository;

@Service
@Transactional
public class MRoleService {
    
    @Autowired
    private MRoleRepository roleRepository; // OositionEntity用のリポジトリ

    public List<MRoleEntity> getRole() {

        return roleRepository.findAll();
    }
}
