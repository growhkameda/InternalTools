package com.example.internaltools.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "m_department")
public class MDepartmentEntity {

    @Id
    private Integer id;
    private String name;
    private String detail;

}
