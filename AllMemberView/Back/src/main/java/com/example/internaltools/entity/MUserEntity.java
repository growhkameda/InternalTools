package com.example.internaltools.entity;

import java.util.Collection;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.example.internaltools.common.Const;

import lombok.Data;

@Data
@Entity
@Table(name = "m_user")
public class MUserEntity implements UserDetails {
    @Id
    @Column(name = Const.ID)
    private Integer id;
    
    @Column(name = Const.EMAIL)
    private String email;
    
    @Column(name = Const.PASSWORD)
    private String password;
    
    @Column(name = Const.ROLE_ID)
    private Integer roleId;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return null;  // 権限があればここで返す
    }

    @Override
    public String getUsername() {
        return email;  // メールアドレスをユーザー名として返す
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;  // アカウントは期限切れではない
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;  // アカウントはロックされていない
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;  // 認証情報は期限切れではない
    }

    @Override
    public boolean isEnabled() {
        return true;  // アカウントは有効である
    }
}
