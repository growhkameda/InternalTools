package com.example.internaltools.entity;

import java.util.Collection;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

public class SecurityUserDetails implements UserDetails {

    private final MUserEntity mUser;

    // コンストラクタでMUserEntityを受け取る
    public SecurityUserDetails(MUserEntity mUser) {
        this.mUser = mUser;
    }
    
    // AuthServiceからMUserEntity本体を取得するために使います
    public MUserEntity getUser() {
        return this.mUser;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // 必要に応じて権限情報をここで返す
        return null; 
    }

    @Override
    public String getPassword() {
        return this.mUser.getPassword();
    }

    @Override
    public String getUsername() {
        return this.mUser.getEmail(); // emailをusernameとして使用
    }

    // ↓以下のメソッドは通常trueを返す形で問題ありません
    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}