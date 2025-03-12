package com.example.internaltools.dto;

import lombok.Data;

@Data
public class DtoPasswordInfo {

	private String currentPassword;
	private String newPassword;
	private int userId;
}
