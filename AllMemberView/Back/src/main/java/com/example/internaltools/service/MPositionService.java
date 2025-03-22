package com.example.internaltools.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.internaltools.entity.MPositionEntity;
import com.example.internaltools.repository.MPositionRepository;

@Service
@Transactional
public class MPositionService {
    
    @Autowired
    private MPositionRepository positionRepository; // OositionEntity用のリポジトリ

    public List<MPositionEntity> getPosition() {

        return positionRepository.findAll();
    }
}
