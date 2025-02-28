package com.example.internaltools.entity;

import lombok.Data;//lombokは勝手にgetter,fotterを作ってくれる

@Data
public class PasswordInfo {

	private String currentPassword;
	private String newPassword;
	private int userId;
}
