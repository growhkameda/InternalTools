package com.example.internaltools.entity;

import java.sql.Blob;
import java.sql.SQLException;
import java.util.Base64;
import java.util.logging.Level;
import java.util.logging.Logger;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.PostLoad;
import jakarta.persistence.Table;
import jakarta.persistence.Transient;

import com.example.internaltools.common.Const;
import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor; 

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "v_user")
public class UserEntity {
	
	private static final Logger logger = Logger.getLogger(UserEntity.class.getName());

	@Id
	@Column(name = Const.USER_ID)
	private Integer userId;
	
	@Column(name = Const.USER_NAME)
    private String userName;
	
	@Column(name = Const.BIRTH_DATE)
    private String birthDate;
	
	@Column(name = Const.BIRTH_PLACE)
    private String birthPlace;
	
	@Column(name = Const.JOINING_MONTH)		//新規DB
	private String joiningMonth;
	
	@Column(name = Const.MEMO)
    private String memo;
	
	@JsonIgnore
	@Column(name = Const.IMAGE)
    private Blob imageBlob;
	
	// これはデータベースのカラムにマッピングされません
	@Transient
	private String image;
	
	// シリアライズ時にimageBlobをBase64に変換する
	@PostLoad
	public void postLoad() {
        try {
            if (imageBlob != null) {
                // Blobの長さを取得
                long length = imageBlob.length();
                // Blobからバイト配列を取得
                byte[] imageBytes = imageBlob.getBytes(1, (int) length);
                this.image = Base64.getEncoder().encodeToString(imageBytes);
            }
        } catch (SQLException e) {
            logger.log(Level.SEVERE, "SQL Error while fetching Blob data", e);
        } catch (Exception e) {
            logger.log(Level.SEVERE, "Unexpected error while converting Blob to Base64", e);
        }
    }
    
    @Column(name = Const.PROJECT_NAME)
    private String projectName;
    
    @Column(name = Const.PROJECT_PLACE)
    private String projectPlace;
    
    @Column(name = Const.HOBBY)
    private String hobby;

}
