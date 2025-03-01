package com.example.internaltools.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.internaltools.entity.UserEntity;
import com.example.internaltools.repository.UserRepository;
import com.example.internaltools.repository.UserUpdateRepository;

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
	
	public void updateUser(UserEntity user) {
	    repository.save(user); // Spring Data JPA の save() を使って更新
	}
	
	@Autowired
    private UserUpdateRepository userUpdateRepository; // `t_user` を更新するためのリポジトリ

    public void updateUser(Integer userId, String userName, String birthDate, String hobby, String image) {
    	userUpdateRepository.updateUser(userId, userName, birthDate, hobby, image);
    }
    
    public boolean deleteUser(Integer userId) {
        Optional<UserEntity> userOpt = repository.findById(userId);
        if (userOpt.isEmpty()) {
            return false; // ユーザーが存在しない場合は false を返す
        }
        userUpdateRepository.deleteUser(userId); // UserUpdateRepository を使って削除
        return true;
    }

    
}
