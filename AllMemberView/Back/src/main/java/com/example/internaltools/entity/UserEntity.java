package com.example.internaltools.entity;

import java.sql.Blob;

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
@Table(name = "v_user")
public class UserEntity {

	@Id
	private Integer user_id;
    private String user_name;
    private String birth_date;
    private String birth_place;
    private String memo;
    private Blob image;
    private String depertment_name;
    private String project_name;
    private String project_place;

}
