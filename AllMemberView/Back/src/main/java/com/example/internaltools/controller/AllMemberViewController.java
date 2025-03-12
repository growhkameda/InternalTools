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

import com.example.internaltools.dto.DtoAuthRequest;
import com.example.internaltools.dto.DtoAuthResponse;
import com.example.internaltools.dto.DtoDepartmentRequest;
import com.example.internaltools.dto.DtoPasswordInfo;
import com.example.internaltools.dto.DtoUserDepartment;
import com.example.internaltools.entity.MDepartmentEntity;
import com.example.internaltools.entity.VUserDepartmentEntity;
import com.example.internaltools.entity.VUserEntity;
import com.example.internaltools.service.AuthService;
import com.example.internaltools.service.MDepartmentService;
import com.example.internaltools.service.MUserService;
import com.example.internaltools.service.TRelUserDepartmentService;
import com.example.internaltools.service.TUserService;
import com.example.internaltools.service.VUserDepartmentService;
import com.example.internaltools.service.VUserService;
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
	private MUserService mUserService;
	
	@Autowired
	private MDepartmentService mDepartmentService;
    
	@Autowired
	private TUserService tUserService;
	
	@Autowired
	private TRelUserDepartmentService tRelUserDepartmentService;
	
	@Autowired
	private VUserService vUserService;
		
	@Autowired
	private VUserDepartmentService vUserDepartmentService;
	
	@Autowired
	private ObjectMapper objectMapper;
	
	@Autowired
	private PasswordEncoder passwordEncoder;
	
    @PostMapping("/login")
    public ResponseEntity<DtoAuthResponse> login(@RequestBody DtoAuthRequest authRequest) {
    	
    	String en = passwordEncoder.encode(authRequest.getPassword());
    	System.out.println(en);
    	
        String token = authService.login(authRequest);
        return ResponseEntity.ok(new DtoAuthResponse(token));
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

            List<VUserEntity> userList = vUserService.getAllUsers(); // DB内のデータを全件取得
            List<VUserDepartmentEntity> depatmentList = vUserDepartmentService.getAllUserDepartment();
            
            for(VUserEntity user : userList) {
            	DtoUserDepartment userDepartment = new DtoUserDepartment();
            	
            	List<VUserDepartmentEntity> tmpDepartmentList = new ArrayList<>();
            	for(VUserDepartmentEntity department : depatmentList) {
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
    public ResponseEntity<String> getUsersByDepartment(@RequestHeader("Authorization") String token, @RequestBody DtoDepartmentRequest departmentRequest) {
        String returnValue = "";
        try {
            String jwt = token.substring(7);
            jwtUtil.extractUserId(jwt);

            // 指定された部署のユーザーを取得
            Map<Integer, List<VUserDepartmentEntity>> userDepartmentMap = new HashMap<>();
            List<DtoUserDepartment> resultList = new ArrayList<>();
            Set<Integer> memberIdList = new HashSet<>();
            
            // 部署に紐づくユーザIDを取得
            for(Integer departmentId : departmentRequest.getDepartmentId()) {
            	List<VUserDepartmentEntity> tmpDepatmentList = vUserDepartmentService.findUsersByDepartmentId(departmentId);
            	for(VUserDepartmentEntity tmpDepatment : tmpDepatmentList) {
            		Integer userId = tmpDepatment.getUserId();
            		
            		memberIdList.add(userId);
            		
            		// 初回格納時に格納するための空のリストを追加
            		if(!userDepartmentMap.containsKey(userId)) {
            			userDepartmentMap.put(userId, new ArrayList<VUserDepartmentEntity>());
            		}
            		
            		// ユーザID毎に部署情報をまとめなおす
            		userDepartmentMap.get(userId).add(tmpDepatment);
            	}
            }
            
            // 部署情報とユーザ情報を格納
            for (Integer userId : memberIdList) {
            	DtoUserDepartment userDepartment = new DtoUserDepartment();
            	userDepartment.setUser(vUserService.getUserById(userId));
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

            List<VUserEntity> userList = vUserService.getBirthUser(); // DB内の誕生日月データを全件取得
            List<VUserDepartmentEntity> depatmentList = vUserDepartmentService.getAllUserDepartment();
            
            for(VUserEntity user : userList) {
            	DtoUserDepartment userDepartment = new DtoUserDepartment();
            	
            	List<VUserDepartmentEntity> tmpDepartmentList = new ArrayList<>();
            	for(VUserDepartmentEntity department : depatmentList) {
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
    		@RequestParam String joiningMonth) {
    	
    		String returnValue = "";
    		try {
    			// トークンの"Bearer"プレフィックスを削除して検証
    			String jwt = token.substring(7);
    			jwtUtil.extractUserId(jwt);
    			
    			// サービスでDBから今月入社の社員(現状はuserIdでフィルタリング)を取得
    			List<VUserEntity> userList = vUserService.getEmployeesByJoiningMonth(joiningMonth);	//DB実装後引数をjoiningMonth(予定)に変更
    			
    			// すべての社員の部署情報を取得
    			List<VUserDepartmentEntity> departmentList = vUserDepartmentService.getAllUserDepartment();	//DB実装後引数をjoiningMonth(予定)に変更
    			
    			// 各社員に対して所属部署情報をDTOにまとめる
    			List<DtoUserDepartment> resultList = new ArrayList<>();
    			for (VUserEntity user : userList) {
    				DtoUserDepartment userDepartment = new DtoUserDepartment();
    				List<VUserDepartmentEntity> tmpDepartmentList = new ArrayList<>();
    				
    				// 取得した部署情報から該当社員の情報だけを取得
    				for (VUserDepartmentEntity department : departmentList) {
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
            List<MDepartmentEntity> organizationChart = mDepartmentService.getDepartment();
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
	public ResponseEntity<String> changePassword(@RequestHeader("Authorization") String token, @RequestBody DtoPasswordInfo passwordData) {
		try {
			System.out.println("パスワード変更ボタン押下後の変更処理開始");
			// トークンの"Bearer "プレフィックスを削除
			String jwt = token.substring(7);

			// torkenの検証
			jwtUtil.extractUserId(jwt);
			int userId = jwtUtil.extractUserId(jwt);
			

			// MUserServiceを使ってパスワード変更処理
			String returnValue = mUserService.changePassword(passwordData,userId);

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
            VUserEntity user = vUserService.getUserById(id);
            if (user == null) {
                System.out.println("ユーザーが見つかりませんでした: " + id);
                return ResponseEntity.status(404).body(Map.of("error", "User not found", "userId", id));
            }

            System.out.println("取得したユーザー情報: " + user.toString());

            // ユーザーの部署情報を取得
            List<VUserDepartmentEntity> departmentList = vUserDepartmentService.getAllUserDepartment();

            // 指定したユーザーに関連する部署だけをフィルタリング
            List<VUserDepartmentEntity> tmpDepartmentList = new ArrayList<>();
            for (VUserDepartmentEntity department : departmentList) {
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
        @RequestParam(required = false) String userName,
        @RequestParam(required = false) String birthDate,
        @RequestParam(required = false) String hobby,
        @RequestParam(required = false) String image,
        @RequestParam(required = false) String joiningMonth
    ) {
        try {
        	
            String jwt = token.substring(7);
            jwtUtil.extractUserId(jwt); // JWT の検証

            // `t_user` を更新
            tUserService.updateUser(id, userName, birthDate, hobby, image, joiningMonth);

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

            // Mユーザ情報削除
            mUserService.deleteUser(id);
            
            // Tユーザー削除
            tUserService.deleteUser(id);
            
            // 関連部署情報削除
            tRelUserDepartmentService.deleteUserDepartment(id);
            
            return ResponseEntity.ok(Map.of("message", "User deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Error deleting user", "message", e.getMessage()));
        }
    }

}