package com.example.internaltools.dto;

import java.util.List;

import com.example.internaltools.common.Const;
import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor; 

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DtoNewUser {
	
	@JsonProperty(Const.JSON_USER_ID)
	private Integer userId;
	
	@JsonProperty(Const.JSON_EMAIL)
	private String eMail;
	
	@JsonProperty(Const.JSON_PASSWORD)
	private String password;
	
	@JsonProperty(Const.JSON_ROLE_ID)
	private Integer roleId;
	
	@JsonProperty(Const.JSON_USER_NAME)
	private String userName;
	
	@JsonProperty(Const.JSON_JOINING_MONTH)
	private String joiningMonth;
	
	@JsonProperty(Const.JSON_DEPARTMENT_POSITION_LIST)
	private List<DtoNewDepartmentPosition> departmentPosisitionIdList;
	
	@JsonProperty(Const.JSON_BIRTH_DATE)
	private String birthDate;
	
	@JsonProperty(Const.JSON_HOBBY)
	private String hobby;
	
	@JsonProperty(Const.JSON_IMAGE)
	private String image;

	@JsonProperty(Const.RUBY)
	private String ruby;
	
}