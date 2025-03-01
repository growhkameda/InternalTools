package com.example.internaltools.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "t_user") // "t_user" に対応
public class UserUpdateEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id") // "t_user" のカラムに合わせる
    private Integer userId;

    @Column(name = "name") // "t_user" のカラムに合わせる
    private String userName;

    @Column(name = "birth_date") // "t_user" のカラムに合わせる
    private String birthDate;

    @Column(name = "hobby") // "t_user" のカラムに合わせる
    private String hobby;

    @Column(name = "image") // "t_user" のカラムに合わせる
    private String image;

    // Getter & Setter
}
