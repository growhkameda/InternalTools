package com.example.internaltools.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import com.example.internaltools.common.Const;

import lombok.Data;

@Data
@Entity
@Table(name = "m_position")
public class MPositionEntity {
    @Id
    @Column(name = Const.ID)
    private Integer id;
    
    @Column(name = Const.NAME)
    private String name;
    
}
