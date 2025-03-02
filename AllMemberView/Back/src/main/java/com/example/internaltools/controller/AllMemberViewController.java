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
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.example.internaltools.dto.DtoUserDepartment;
import com.example.internaltools.entity.AuthRequest;
import com.example.internaltools.entity.AuthResponse;
import com.example.internaltools.entity.DepartmentEntity;
import com.example.internaltools.entity.DepartmentRequest;
import com.example.internaltools.entity.PasswordInfo;
import com.example.internaltools.entity.UserDepartmentEntity;
import com.example.internaltools.entity.UserEntity;
import com.example.internaltools.service.AuthService;
import com.example.internaltools.service.AuthServiceChangePassword;
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
    
    @PostMapping("/department-users")
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
            		Integer userId = tmpDepatment.getUserId();
            		
            		memberIdList.add(userId);
            		
            		// 初回格納時に格納するための空のリストを追加
            		if(!userDepartmentMap.containsKey(userId)) {
            			userDepartmentMap.put(userId, new ArrayList<UserDepartmentEntity>());
            		}
            		
            		// ユーザID毎に部署情報をまとめなおす
            		userDepartmentMap.get(userId).add(tmpDepatment);
            	}
            }
            
            // 部署情報とユーザ情報を格納
            for (Integer userId : memberIdList) {
            	DtoUserDepartment userDepartment = new DtoUserDepartment();
            	userDepartment.setUser(userService.getUserById(userId));
            	userDepartment.setDepartment(userDepartmentMap.get(userId));
            	resultList.add(userDepartment);
            }
            
            returnValue = objectMapper.writeValueAsString(resultList);
            
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error retrieving users for department");
        }

        return ResponseEntity.ok(returnValue);
    }
    
    @GetMapping("/birthuserinfo")
    public ResponseEntity<String> getBirthUser(@RequestHeader("Authorization") String token) {
        String returnValue = "";
        try {
            // トークンの"Bearer "プレフィックスを削除
            String jwt = token.substring(7);

            // torkenの検証
            jwtUtil.extractUserId(jwt);
            
            List<DtoUserDepartment> resultList = new ArrayList<>();

            List<UserEntity> userList = userService.getBirthUser(); // DB内の誕生日月データを全件取得
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
    
    // 現在年月に入社した社員のデータを取得し送信する
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
    
	// パスワード変更エンドポイント
	@PostMapping("/change-password")
	public ResponseEntity<String> changePassword(@RequestHeader("Authorization") String token, @RequestBody PasswordInfo passwordData) {
		try {
			System.out.println("パスワード変更ボタン押下後の変更処理開始");
			// トークンの"Bearer "プレフィックスを削除
			String jwt = token.substring(7);

			// torkenの検証
			jwtUtil.extractUserId(jwt);
			int userId = jwtUtil.extractUserId(jwt);
			

			// AuthServiceを使ってパスワード変更処理
			String returnValue = AuthServiceChangePassword.changePassword(passwordData,userId);

			return ResponseEntity.ok(returnValue);
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(500).body("Error retrieving user data");
		}
	}
	
    @GetMapping("/user/{id}")
    public ResponseEntity<?> getUserById(@RequestHeader("Authorization") String token, @PathVariable Integer id) {
        try {
            System.out.println("APIリクエスト: /user/" + id);
            
            // トークンの"Bearer "プレフィックスを削除
            String jwt = token.substring(7);
            jwtUtil.extractUserId(jwt); // トークンの検証

            // ユーザー情報を取得
            UserEntity user = userService.getUserById(id);
            if (user == null) {
                System.out.println("ユーザーが見つかりませんでした: " + id);
                return ResponseEntity.status(404).body(Map.of("error", "User not found", "userId", id));
            }

            System.out.println("取得したユーザー情報: " + user.toString());

            // ユーザーの部署情報を取得
            List<UserDepartmentEntity> departmentList = userDepartmentService.getAllUserDepartment();

            // 指定したユーザーに関連する部署だけをフィルタリング
            List<UserDepartmentEntity> tmpDepartmentList = new ArrayList<>();
            for (UserDepartmentEntity department : departmentList) {
                if (department.getUserId().equals(user.getUserId())) {
                    tmpDepartmentList.add(department);
                }
            }

            // DTOにデータを格納
            DtoUserDepartment resultList = new DtoUserDepartment();
            resultList.setUser(user);
            resultList.setDepartment(tmpDepartmentList);

            // JSON に変換
            String returnValue = objectMapper.writeValueAsString(resultList);

            // 正常なレスポンスを返す
            return ResponseEntity.ok(returnValue);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of(
                "error", "Error retrieving user data",
                "message", e.getMessage()
            ));
        }
    }
    
    @PutMapping("/user/{id}")
    public ResponseEntity<?> updateUser(
        @RequestHeader("Authorization") String token,
        @PathVariable Integer id,
        @RequestParam(value = "userName", required = false) String userName,
        @RequestParam(value = "birthDate", required = false) String birthDate,
        @RequestParam(value = "hobby", required = false) String hobby,
        @RequestParam(value = "image", required = false) String image,
        @RequestParam(value = "joiningMonth", required = false) String joiningMonth
    ) {
        try {
        	
            String jwt = token.substring(7);
            jwtUtil.extractUserId(jwt); // JWT の検証

            // `t_user` を更新
            userService.updateUser(id, userName, birthDate, hobby, image, joiningMonth);

            return ResponseEntity.ok(Map.of("message", "User updated successfully"));

        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Error updating user", "message", e.getMessage()));
        }
    }

    @DeleteMapping("/user/{id}")
    public ResponseEntity<?> deleteUser(@RequestHeader("Authorization") String token, @PathVariable Integer id) {
        try {
            String jwt = token.substring(7);
            jwtUtil.extractUserId(jwt); // トークンの検証

            // ユーザー削除
            boolean deleted = userService.deleteUser(id);
            if (!deleted) {
                return ResponseEntity.status(404).body(Map.of("error", "User not found", "userId", id));
            }

            return ResponseEntity.ok(Map.of("message", "User deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Error deleting user", "message", e.getMessage()));
        }
    }

}