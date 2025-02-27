package com.example.internaltools.entity;

import java.sql.Blob;

import com.example.internaltools.common.Const;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor; 

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "v_user")
public class UserEntity {

	@Id
	@Column(name = Const.USER_ID)
	private Integer userId;
	
	@Column(name = Const.USER_NAME)
    private String userName;
	
	@Column(name = Const.BIRTH_DATE)
    private String birthDate;
	
	@Column(name = Const.BIRTH_PLACE)
    private String birthPlace;
	
	@Column(name = Const.MEMO)
    private String memo;
	
	@Column(name = Const.IMAGE)
    private Blob image;
    
    @Column(name = Const.DEPARTMENT_NAME)
    private String departmentName; 
    
    @Column(name = Const.DEPARTMENT_ID)
    private Integer departmentId;
    
    @Column(name = Const.PROJECT_NAME)
    private String projectName;
    
    @Column(name = Const.PROJECT_PLACE)
    private String projectPlace;
    
    @Column(name = Const.JOINING_MONTH)
    private String joiningMonth;
    
}
