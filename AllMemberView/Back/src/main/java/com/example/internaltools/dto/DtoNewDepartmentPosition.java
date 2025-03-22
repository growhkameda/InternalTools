package com.example.internaltools.dto;

import com.example.internaltools.common.Const;
import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor; 

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DtoNewDepartmentPosition {

	@JsonProperty(Const.JSON_DEPARTMENT_ID)
	private Integer departmentId;
	
	@JsonProperty(Const.JSON_POSITION_ID)
	private Integer positionId;
	
}