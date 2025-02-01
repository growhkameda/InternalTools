package com.example.internaltools.entity;

import java.util.Collection;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import lombok.Data;

@Data
@Entity
@Table(name = "m_user")
public class LoginUser implements UserDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String email;
    private String password;
 // 追加: ユーザーの役割を示すフィールド（例: 1=管理者, 0=一般ユーザー）
    private Integer role_id;
    
    public Integer getRole() {
        return role_id;
    }

    public void setRole(Integer role) {
        this.role_id = role;
    }

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
