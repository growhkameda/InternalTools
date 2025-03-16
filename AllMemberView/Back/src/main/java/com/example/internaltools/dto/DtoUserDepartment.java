package com.example.internaltools.dto;

import java.util.List;

import com.example.internaltools.entity.MDepartmentEntity;
import com.example.internaltools.entity.MPositionEntity;
import com.example.internaltools.entity.MRoleEntity;
import com.example.internaltools.entity.VUserDepartmentEntity;
import com.example.internaltools.entity.VUserEntity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor; 

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DtoUserDepartment {

	private VUserEntity user;
	
    private List<VUserDepartmentEntity> department;
    
    private List<MDepartmentEntity> selectDepartmentList;
    
    private List<MPositionEntity> selectPositionList;
    
    private List<MRoleEntity> selectRoleList;

}