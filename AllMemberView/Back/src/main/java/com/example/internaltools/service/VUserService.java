package com.example.internaltools.service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.internaltools.entity.VUserEntity;
import com.example.internaltools.repository.VUserRepository;

@Service
@Transactional
public class VUserService {
	
	@Autowired
	private VUserRepository vUserRepository;
	
	public List<VUserEntity> getAllUsers() {
        return vUserRepository.findAll();
    }
	
	public VUserEntity getUserById(Integer id) {
        return vUserRepository.findById(id).get();
    }
	
	// 今月が誕生日の社員を呼び出し取得
	public List<VUserEntity> getBirthUser() {
		int month = LocalDate.now().getMonthValue();
		String monthStr = String.valueOf(month);
		return vUserRepository.findUsersByBirthMonth(monthStr);
	}
	
	// フロントから受け取った入社年月(joiningMonth)からリポジトリのメソッドを呼び出し該当社員のリストを返す
	public List<VUserEntity> getEmployeesByJoiningMonth(String joiningMonth) {
		return vUserRepository.findEmployeesByJoiningMonth(joiningMonth);
	}
    
}
