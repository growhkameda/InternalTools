package com.example.internaltools.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.IdClass;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

import com.example.internaltools.common.Const;
import com.example.internaltools.expansion.UserDepartmentId;
import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor; 

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "v_user_department")
@IdClass(UserDepartmentId.class) // 複合キーを指定
public class UserDepartmentEntity {

	@Id
	@Column(name = Const.USER_ID)
	private Integer userId;
	
	@Id
	@Column(name = Const.DEPARTMENT_ID)
    private Integer departmentId;
	
	@Column(name = Const.DEPARTMENT_NAME)
    private String departmentName;
	
	@Column(name = Const.POSITION_ID)
    private Integer positionId;
	
	@Column(name = Const.POSITION_NAME)
    private String positionName;
	
	//UserEntity とのリレーションを追加
    @ManyToOne
    @JoinColumn(name = Const.USER_ID, insertable = false, updatable = false)
    @JsonIgnore
    private UserEntity user;
    
    @Override
    public String toString() {
        return "UserDepartmentEntity{" +
                "userId=" + userId +
                ", departmentId=" + departmentId +
                ", departmentName='" + departmentName + '\'' +
                ", positionId=" + positionId +
                ", positionName='" + positionName + '\'' +
                '}'; // ✅ `user` を含めない
    }
	
}
