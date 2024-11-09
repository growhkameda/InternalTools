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
@Table(name = "m_project")
public class ProjectEntity {

	@Id
	private Integer project_id;
    private String project_name;
    private String project_detail;
    private String project_type;
    private String project_place;

}