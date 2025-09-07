package com.example.internaltools.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import com.example.internaltools.common.Const;

import lombok.Data;

@Data
@Entity
@Table(name = "m_user")
public class MUserEntity { // ← implements UserDetails を削除

    @Id
    @Column(name = Const.ID)
    private Integer id;
    
    @Column(name = Const.EMAIL)
    private String email;
    
    @Column(name = Const.PASSWORD)
    private String password;
    
    @Column(name = Const.ROLE_ID)
    private Integer roleId;
    
    // UserDetailsに関連するメソッドはすべて削除
}