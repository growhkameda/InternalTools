package com.example.internaltools.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.internaltools.entity.PasswordInfo;
import com.example.internaltools.entity.UserPasswordInfo;
import com.example.internaltools.repository.PasswordChangeRepository;

@Service
public class AuthServiceChangePassword {

    @Autowired
    private static PasswordChangeRepository passwordChangeRepository;
    
    @Autowired
    private static PasswordEncoder passwordEncoder;
    
    
    public AuthServiceChangePassword(PasswordChangeRepository passwordChangeRepository, PasswordEncoder passwordEncoder) {
        AuthServiceChangePassword.passwordChangeRepository = passwordChangeRepository;
        AuthServiceChangePassword.passwordEncoder = passwordEncoder;
    }
    
    @Transactional
    public static String changePassword(PasswordInfo passwordData,int userId) throws Exception {
        // ユーザーの情報を取得
        UserPasswordInfo userEntityChangePassword = passwordChangeRepository.findById(userId);
        
        /*if (userEntityChangePassword == null) {
            throw new UsernameNotFoundException("ユーザーが見つかりません");
        }*/

        // 現在のパスワードを検証
        if (!passwordEncoder.matches(passwordData.getCurrentPassword() ,userEntityChangePassword.getPassword())) {
            throw new IllegalArgumentException("パスワードが正しくありません");
        }
        
        // 新しいパスワードをエンコードして保存
        String encodePassword = (passwordEncoder.encode(passwordData.getNewPassword()));
        //saveでどこを保存するか、where句を追加
        
        //encodeのインスタンス
        //UserPasswordInfo resistPassword = new UserPasswordInfo();
        //resistPassword.setPassword(encodePassword);
        
        passwordChangeRepository.updatePassword(encodePassword,userId);//＠Queryつけて、SQL文にして、save→updateに書き換え
       
        return "パスワードが正常に変更されました";
    }
}
  