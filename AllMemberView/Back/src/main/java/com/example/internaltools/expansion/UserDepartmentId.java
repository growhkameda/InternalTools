package com.example.internaltools.expansion;

import java.io.Serializable;
import java.util.Objects;

public class UserDepartmentId implements Serializable {

    private Integer userId;
    private Integer departmentId;

    // コンストラクタ、equals(), hashCode()を実装
    public UserDepartmentId() {}

    public UserDepartmentId(Integer userId, Integer departmentId) {
        this.userId = userId;
        this.departmentId = departmentId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        UserDepartmentId that = (UserDepartmentId) o;
        return Objects.equals(userId, that.userId) && 
               Objects.equals(departmentId, that.departmentId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(userId, departmentId);
    }
}
