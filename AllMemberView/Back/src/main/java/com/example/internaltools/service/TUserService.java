package com.example.internaltools.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.internaltools.repository.TUserRepository;

@Service
@Transactional
public class TUserService {
		
	@Autowired
    private TUserRepository tUserUpdateRepository;
	
	// ユーザIDに紐づくユーザ情報を更新
    public void updateUser(Integer userId, String userName, String birthDate, String hobby, String image, String joiningMonth, String ruby) {
    //tUserUpdateRepository.updateUser(userId, userName, birthDate, hobby, image, joiningMonth);
    	tUserUpdateRepository.updateUser(userId, userName, birthDate, hobby, image, joiningMonth, ruby);
    }
    
    // ユーザIDに紐づくユーザ情報を削除
    public void deleteUser(Integer userId) {
        tUserUpdateRepository.deleteUser(userId);
    }
    
}
