package com.example.internaltools.entity;

import lombok.Data;

@Data
public class PasswordInfo {

	private String currentPassword;
	private String newPassword;
	private int userId;
}
