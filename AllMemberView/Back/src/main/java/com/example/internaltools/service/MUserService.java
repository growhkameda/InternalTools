package com.example.internaltools.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.internaltools.dto.DtoPasswordInfo;
import com.example.internaltools.entity.MUserEntity;
import com.example.internaltools.repository.MUserRepository;

@Service
public class MUserService implements UserDetailsService {

    @Autowired
    private MUserRepository mUserRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public MUserEntity loadUserByUsername(String username) throws UsernameNotFoundException {
        MUserEntity user = mUserRepository.findByEmail(username).get(); // メールでユーザーを検索
        if (user == null) {
            throw new UsernameNotFoundException("User not found");
        }
        return user;  // LoginUser を返す
    }
    
    public MUserEntity getUserById(Integer userId) throws UsernameNotFoundException {
        Optional<MUserEntity> user = mUserRepository.findById(userId); // メールでユーザーを検索
        if (user.isEmpty()) {
        	return null;
        }
        return user.get();
    }

    // ユーザIDに紐づくユーザ情報を削除
    public void deleteUser(Integer userId) {
    	mUserRepository.deleteUser(userId);
    }
    
    @Transactional
    public String changePassword(DtoPasswordInfo passwordData,int userId) throws Exception {
        // ユーザーの情報を取得
    	MUserEntity mUserEntity = mUserRepository.findById(userId).get();
        
        if (mUserEntity == null) {
            throw new UsernameNotFoundException("ユーザーが見つかりません");
        }

        // 現在のパスワードを検証
        if (!passwordEncoder.matches(passwordData.getCurrentPassword() ,mUserEntity.getPassword())) {
            throw new IllegalArgumentException("パスワードが正しくありません");
        }
        
        // 新しいパスワードをエンコードして保存
        String encodePassword = (passwordEncoder.encode(passwordData.getNewPassword()));
        
        mUserRepository.updatePassword(encodePassword,userId);//＠Queryつけて、SQL文にして、save→updateに書き換え
       
        return "パスワードが正常に変更されました";
    }

}
