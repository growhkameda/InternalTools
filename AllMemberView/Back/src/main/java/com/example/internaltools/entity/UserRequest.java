package com.example.internaltools.entity;

import java.util.List;

import com.example.internaltools.common.Const;
import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;

@Data

public class UserRequest {
	@JsonProperty("userId")
	private Integer userId;
}
