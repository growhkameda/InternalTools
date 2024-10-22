package com.example.internaltools.entity;

import lombok.Data;

@Data
public class AuthRequest {
	private String email;
    private String password;
}
