package com.example.internaltools.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import com.example.internaltools.common.Const;

import lombok.Data;

@Entity
@Data
@Table(name = "t_user") // "t_user" に対応
public class TUserEntity {

    @Id
    @Column(name = Const.ID) // "t_user" のカラムに合わせる
    private Integer userId;

    @Column(name = Const.NAME) // "t_user" のカラムに合わせる
    private String userName;

    @Column(name = Const.BIRTH_DATE) // "t_user" のカラムに合わせる
    private String birthDate;

    @Column(name = Const.HOBBY) // "t_user" のカラムに合わせる
    private String hobby;

    @Column(name = Const.IMAGE) // "t_user" のカラムに合わせる
    private String image;
    
    @Column(name = Const.JOINING_MONTH) // "t_user" のカラムに合わせる
    private String joiningMonth;
    
    @Column(name = Const.MBTI) // "t_user" のカラムに合わせる
    private String mbti;


    @Column(name = Const.RUBY) // "t_user" のカラムに合わせる
    private String ruby;
}
