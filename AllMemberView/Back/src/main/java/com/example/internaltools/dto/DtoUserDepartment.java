package com.example.internaltools.dto;

import java.util.List;

import com.example.internaltools.entity.UserDepartmentEntity;
import com.example.internaltools.entity.UserEntity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor; 

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DtoUserDepartment {

	private UserEntity user;
	
    private List<UserDepartmentEntity> department;

}