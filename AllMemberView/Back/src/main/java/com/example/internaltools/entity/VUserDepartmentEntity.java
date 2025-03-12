package com.example.internaltools.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.IdClass;
import jakarta.persistence.Table;

import com.example.internaltools.common.Const;
import com.example.internaltools.expansion.UserDepartmentId;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor; 

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "v_user_department")
@IdClass(UserDepartmentId.class) 
public class VUserDepartmentEntity {

	@Id
	@Column(name = Const.USER_ID)
	private Integer userId;
	
	@Id
	@Column(name = Const.DEPARTMENT_ID)
    private Integer departmentId;
	
	@Column(name = Const.DEPARTMENT_NAME)
    private String departmentName;
	
	@Column(name = Const.POSITION_ID)
    private Integer positionId;
	
	@Column(name = Const.POSITION_NAME)
    private String positionName;
	
}
