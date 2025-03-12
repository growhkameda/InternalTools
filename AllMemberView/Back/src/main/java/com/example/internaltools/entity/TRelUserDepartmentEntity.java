package com.example.internaltools.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import com.example.internaltools.common.Const;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "t_rel_user_department")
public class TRelUserDepartmentEntity {

    @Id
    @Column(name = Const.USER_ID)
    private Integer userId;
    
    @Column(name = Const.DEPARTMENT_ID)
    private Integer departmentId;
    
    @Column(name = Const.POSITION_ID)
    private Integer positionId;

}
