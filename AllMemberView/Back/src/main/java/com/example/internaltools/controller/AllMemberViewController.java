package com.example.internaltools.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;

import com.example.internaltools.dto.DtoUserDepartment;
import com.example.internaltools.entity.AuthRequest;
import com.example.internaltools.entity.AuthResponse;
import com.example.internaltools.entity.DepartmentEntity;
import com.example.internaltools.entity.DepartmentRequest;
import com.example.internaltools.entity.UserDepartmentEntity;
import com.example.internaltools.entity.UserEntity;
import com.example.internaltools.service.AuthService;
import com.example.internaltools.service.DepartmentService;
import com.example.internaltools.service.UserDepartmentService;
import com.example.internaltools.service.UserService;
import com.example.internaltools.utils.JwtUtil;
import com.fasterxml.jackson.databind.ObjectMapper;

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
	private UserDepartmentService userDepartmentService;
	
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
            
            List<DtoUserDepartment> resultList = new ArrayList<>();

            List<UserEntity> userList = userService.getAllUsers(); // DB内のデータを全件取得
            List<UserDepartmentEntity> depatmentList = userDepartmentService.getAllUserDepartment();
            
            for(UserEntity user : userList) {
            	DtoUserDepartment userDepartment = new DtoUserDepartment();
            	
            	List<UserDepartmentEntity> tmpDepartmentList = new ArrayList<>();
            	for(UserDepartmentEntity department : depatmentList) {
            		if(department.getUserId().equals(user.getUserId())) {
            			tmpDepartmentList.add(department);
            		}
            	}
            	
            	userDepartment.setUser(user);
            	userDepartment.setDepartment(tmpDepartmentList);
            	resultList.add(userDepartment);
            }
            
            returnValue = objectMapper.writeValueAsString(resultList);
            
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error retrieving user data");
        }
        
        return ResponseEntity.ok(returnValue);
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
    public ResponseEntity<String> getUsersByDepartment(@RequestHeader("Authorization") String token, @RequestBody DepartmentRequest departmentRequest) {
        String returnValue = "";
        try {
            String jwt = token.substring(7);
            jwtUtil.extractUserId(jwt);

            // 指定された部署のユーザーを取得
            Map<Integer, List<UserDepartmentEntity>> userDepartmentMap = new HashMap<>();
            List<DtoUserDepartment> resultList = new ArrayList<>();
            Set<Integer> memberIdList = new HashSet<>();
            
            // 部署に紐づくユーザIDを取得
            for(Integer departmentId : departmentRequest.getDepartmentId()) {
            	List<UserDepartmentEntity> tmpDepatmentList = userDepartmentService.findUsersByDepartmentId(departmentId);
            	for(UserDepartmentEntity tmpDepatment : tmpDepatmentList) {
            		memberIdList.add(tmpDepatment.getUserId());
            		
            		// 初回格納時に格納するための空のリストを追加
            		if(!userDepartmentMap.containsKey(tmpDepatment.getUserId())) {
            			userDepartmentMap.put(departmentId, new ArrayList<UserDepartmentEntity>());
            		}
            		
            		// ユーザID毎に部署情報をまとめなおす
            		userDepartmentMap.get(departmentId).add(tmpDepatment);
            	}
            }
            
            // 部署情報とユーザ情報を格納
            for (Integer userId : memberIdList) {
            	DtoUserDepartment userDepartment = new DtoUserDepartment();
            	userDepartment.setUser(userService.getUserById(userId));
            	userDepartment.setDepartment(userDepartmentMap.get(userId));
            }
            
            returnValue = objectMapper.writeValueAsString(resultList);
            
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error retrieving users for department");
        }

        return ResponseEntity.ok(returnValue);
    }
	
}package com.example.internaltools.controller;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;

import com.example.internaltools.entity.AuthRequest;
import com.example.internaltools.entity.AuthResponse;
import com.example.internaltools.entity.DepartmentEntity;
import com.example.internaltools.entity.DepartmentRequest;
import com.example.internaltools.entity.UserEntity;
import com.example.internaltools.service.AuthService;
import com.example.internaltools.service.DepartmentService;
import com.example.internaltools.service.UserService;
import com.example.internaltools.utils.JwtUtil;
import com.fasterxml.jackson.databind.ObjectMapper;

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
    public ResponseEntity<List<UserEntity>> getAllUser(@RequestHeader("Authorization") String token) {
        try {
            // トークンの"Bearer "プレフィックスを削除
            String jwt = token.substring(7);

            // torkenの検証
            jwtUtil.extractUserId(jwt);
            
            List<UserEntity> userList = userService.getAllUsers(); // DB内のデータを全件取得
            
            return ResponseEntity.ok(userList);
            
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(null);
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
    public ResponseEntity<String> getUsersByDepartment(@RequestHeader("Authorization") String token, @RequestBody DepartmentRequest departmentRequest) {
        String returnValue = "";
        try {
            String jwt = token.substring(7);
            jwtUtil.extractUserId(jwt);

            // 指定された部署のユーザーを取得
            List<UserEntity> resultList = new ArrayList<>();
            for(Integer departmentId : departmentRequest.getDepartmentId()) {
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