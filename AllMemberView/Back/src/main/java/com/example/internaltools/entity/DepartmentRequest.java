package com.example.internaltools.entity;

import java.util.List;

import com.example.internaltools.common.Const;
import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;

@Data

public class DepartmentRequest {
	@JsonProperty(Const.DEPARTMENT_ID_LIST)
	private List<Integer> departmentId;
}

