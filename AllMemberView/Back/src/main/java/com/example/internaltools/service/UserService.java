package com.example.internaltools.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.internaltools.entity.MUserEntity;
import com.example.internaltools.entity.TRelUserDepartmentEntity;
import com.example.internaltools.entity.TUserEntity;
import com.example.internaltools.repository.MUserRepository;
import com.example.internaltools.repository.TRelUserDepartmentRepository;
import com.example.internaltools.repository.TUserRepository;

@Service
@Transactional
public class UserService {
    
    @Autowired
    private MUserRepository mUserRepository;
    
    @Autowired
    private TUserRepository tUserRepository;
    
    @Autowired
    private TRelUserDepartmentRepository tRelUserDepartmentRepository;
    
    @Autowired
    private TUserService tUserService;

    @Transactional
    public void createNewUser(MUserEntity mUserEntity, TUserEntity tUserEntity, List<TRelUserDepartmentEntity> tRelUserDepartmentEntityList) {
    	
    	try {
    		// MUserの登録処理
    		mUserRepository.save(mUserEntity);
    		
    		// TUserの登録処理
    		tUserRepository.save(tUserEntity);
    		
    		// 部署ユーザ関連テーブルの登録処理
    		for(TRelUserDepartmentEntity tRelUserDepartmentEntity : tRelUserDepartmentEntityList) {
    			tRelUserDepartmentRepository.save(tRelUserDepartmentEntity);    		
    		}
    		
    	} catch (Exception e) {
    		throw e;
    	}
    }
    
    @Transactional
    public void updateUser(Integer userId, String userName, String birthDate, String hobby, String image, String joiningMonth, List<TRelUserDepartmentEntity> tRelUserDepartmentEntityList) {
    	
    	try {
    		 // `t_user` を更新
            tUserService.updateUser(userId, userName, birthDate, hobby, image, joiningMonth);
    		
            //　ユーザIDに紐づく部署情報を一度すべて削除
            List<TRelUserDepartmentEntity> deleteUserDepartmentList = tRelUserDepartmentRepository.findByUserId(userId);
            for(TRelUserDepartmentEntity deleteUserDepartment : deleteUserDepartmentList) {
            	tRelUserDepartmentRepository.delete(deleteUserDepartment);
            }
    		
    		// 部署ユーザ関連テーブルの登録処理
    		for(TRelUserDepartmentEntity tRelUserDepartmentEntity : tRelUserDepartmentEntityList) {
    			tRelUserDepartmentRepository.save(tRelUserDepartmentEntity);    		
    		}
    		
    	} catch (Exception e) {
    		throw e;
    	}
    }
}
