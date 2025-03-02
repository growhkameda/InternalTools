package com.example.internaltools.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;
@Data
@Table(name = "m_user")
@Entity
public class UserPasswordInfo {

    @Id
    @JsonProperty("id")
    private int id;
    @JsonProperty("email")
    private String email;
    @JsonProperty("password")
    private String password; // ハッシュ化されたパスワード
    @Column(name="role_id")
    private int roleId;
    @JsonProperty("username")
    private String userName;
}
