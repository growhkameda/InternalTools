package com.example.internaltools.controller;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;

import com.example.internaltools.entity.AuthRequest;
import com.example.internaltools.entity.AuthResponse;
import com.example.internaltools.entity.DepartmentEntity;
import com.example.internaltools.entity.DepartmentRequest;
import com.example.internaltools.entity.PasswordInfo;
import com.example.internaltools.entity.UserEntity;
import com.example.internaltools.service.AuthService;
import com.example.internaltools.service.AuthServiceChangePassword;
import com.example.internaltools.service.DepartmentService;
import com.example.internaltools.service.UserService;
import com.example.internaltools.utils.JwtUtil;
import com.fasterxml.jackson.databind.ObjectMapper;

@CrossOrigin(origins = "http://localhost:3000")
@Controller
@RequestMapping("/api")
public class AllMemberViewController {

	@Autowired
	private JwtUtil jwtUtil;

	@Autowired
	private AuthService authService;

	@Autowired
	private UserService userService;

	@Autowired
	private DepartmentService departmentService;

	@Autowired
	private ObjectMapper objectMapper;

	@Autowired
	private PasswordEncoder passwordEncoder;

	@PostMapping("/login")
	public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest authRequest) {

		String en = passwordEncoder.encode(authRequest.getPassword());
		System.out.println(en);

		String token = authService.login(authRequest);
		return ResponseEntity.ok(new AuthResponse(token));
	}

	@GetMapping("/info")
	public String getUserInfo(@RequestHeader("Authorization") String token) {
		// トークンの"Bearer "プレフィックスを削除
		String jwt = token.substring(7);

		// JWTトークンからユーザーIDを取得
		Integer userId = jwtUtil.extractUserId(jwt);

		return "User ID: " + userId;
	}

	@GetMapping("/alluserinfo")
	public ResponseEntity<String> getAllUser(@RequestHeader("Authorization") String token) {
		String returnValue = "";
		try {
			// トークンの"Bearer "プレフィックスを削除
			String jwt = token.substring(7);

			// torkenの検証
			jwtUtil.extractUserId(jwt);

			List<UserEntity> userList = userService.getAllUsers(); // DB内のデータを全件取得
			returnValue = objectMapper.writeValueAsString(userList);

		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(500).body("Error retrieving user data");
		}

		return ResponseEntity.ok(returnValue);
	}

	// パスワード変更エンドポイント
	@PostMapping("/change-password")
	public String changePassword(@RequestHeader("Authorization") String token, @RequestBody PasswordInfo passwordData) {
		try {
			System.out.println("パスワード変更ボタン押下後の変更処理開始");
			// トークンの"Bearer "プレフィックスを削除
			String jwt = token.substring(7);

			// torkenの検証
			jwtUtil.extractUserId(jwt);
			Integer userId = jwtUtil.extractUserId(jwt);
			passwordData.setUserId(userId);
			//パスワードをエンコード
			//String en = passwordEncoder.encode(passwordData.getCurrentPassword());
			//passwordData.setCurrentPassword(en);

			// AuthServiceを使ってパスワード変更処理
			return AuthServiceChangePassword.changePassword(passwordData);
		} catch (Exception e) {
			return "エラーが発生しました: " + e.getMessage();
		}
	}

	//urlの方と表示を変える
	@GetMapping("organization")
	public ResponseEntity<String> getAllgetDepartment(@RequestHeader("Authorization") String token) {
		String returnValue = "";
		try {
			String jwt = token.substring(7);
			jwtUtil.extractUserId(jwt);

			// 組織図データの取得
			List<DepartmentEntity> organizationChart = departmentService.getDepartment();
			returnValue = objectMapper.writeValueAsString(organizationChart);
			System.out.println(returnValue);

		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(500).body("Error retrieving organization chart data");
		}

		return ResponseEntity.ok(returnValue);
	}

	@PostMapping("department-users")
	public ResponseEntity<String> getUsersByDepartment(@RequestHeader("Authorization") String token,
			@RequestBody DepartmentRequest departmentRequest) {
		String returnValue = "";
		try {
			String jwt = token.substring(7);
			jwtUtil.extractUserId(jwt);

			// 指定された部署のユーザーを取得
			List<UserEntity> resultList = new ArrayList<>();
			for (Integer departmentId : departmentRequest.getDepartmentId()) {
				List<UserEntity> users = userService.findUsersByDepartmentName(departmentId);
				resultList.addAll(users);
			}

			returnValue = objectMapper.writeValueAsString(resultList);

		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(500).body("Error retrieving users for department");
		}

		return ResponseEntity.ok(returnValue);
	}

}