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
import org.springframework.web.bind.annotation.RequestParam;

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
    
    // 現在月に入社した社員を取得し送信する
    @GetMapping("/users-by-newEmployee")
    public ResponseEntity<String> getEmployeesByJoiningMonth(
    		@RequestHeader("Authorization") String token,
    		@RequestParam("joiningMonth") String joiningMonth) {
    	
    		String returnValue = "";
    		try {
    			// トークンの"Bearer"プレフィックスを削除して検証
    			String jwt = token.substring(7);
    			jwtUtil.extractUserId(jwt);
    			
    			// サービスでDBから今月入社の社員(現状はuserIdでフィルタリング)を取得
    			List<UserEntity> userList = userService.getEmployeesByJoiningMonth(joiningMonth);	//DB実装後引数をjoiningMonth(予定)に変更
    			
    			// すべての社員の部署情報を取得
    			List<UserDepartmentEntity> departmentList = userDepartmentService.getAllUserDepartment();	//DB実装後引数をjoiningMonth(予定)に変更
    			
    			// 各社員に対して所属部署情報をDTOにまとめる
    			List<DtoUserDepartment> resultList = new ArrayList<>();
    			for (UserEntity user : userList) {
    				DtoUserDepartment userDepartment = new DtoUserDepartment();
    				List<UserDepartmentEntity> tmpDepartmentList = new ArrayList<>();
    				
    				// 取得した部署情報から該当社員の情報だけを取得
    				for (UserDepartmentEntity department : departmentList) {
    					if (department.getUserId().equals(user.getUserId())) {
    						tmpDepartmentList.add(department);
    					}
    				}
    				
    				userDepartment.setUser(user);
    				userDepartment.setDepartment(tmpDepartmentList);
    				resultList.add(userDepartment);
    			}
    			
    			// DTOリストをJSONに変換
    			returnValue = objectMapper.writeValueAsString(resultList);
    				
    		} catch (Exception e) {
    			e.printStackTrace();
    			return ResponseEntity.status(500).body("Error retrieving filtered user data");
    		}
    		
    		return ResponseEntity.ok(returnValue);
    }
    
    
    // urlの方と表示を変える
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
	
}