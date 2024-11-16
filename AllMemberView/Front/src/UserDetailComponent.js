import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  FormControl,
  InputLabel,
  OutlinedInput,
  Avatar,
  Switch,
  Typography,
  MenuItem,
  Select,
} from "@mui/material";
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import { jwtDecode } from "jwt-decode";

const UserProfile = ({ isNewUser = false }) => {
  const initialProfile = {
    name: "佐藤 太郎",
    email: "",
    password: "",
    positionId: 2,
    projectId: 1,
    hometown: "東京都",
    birthDate: "1990年1月1日",
    hobbies: "読書、旅行",
    image: "https://randomuser.me/api/portraits/men/1.jpg",
    roleId: 2, // 追加: 権限IDを初期値として設定
  };

  const positions = [
    { id: 1, name: "事務経理" },
    { id: 2, name: "営業担当" },
    { id: 3, name: "システムエンジニア" },
  ];

  const projects = [
    { id: 1, name: "新システム導入" },
    { id: 2, name: "顧客管理システム" },
    { id: 3, name: "ウェブサイト開発" },
  ];

  const roles = [
    { id: 1, name: "管理者" },
    { id: 2, name: "一般" },
  ];

  const [isEditing, setIsEditing] = useState(isNewUser);
  const [profile, setProfile] = useState(initialProfile);
  const [image, setImage] = useState(profile.image);
  const [imageBinary, setImageBinary] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false); // 管理者かどうかの状態

  useEffect(() => {
    // トークンからisAdminを取得
    const token = localStorage.getItem("token"); // ローカルストレージからトークンを取得
    if (token) {
      const decodedToken = jwtDecode(token);
      setIsAdmin(decodedToken.isAdmin); // トークン内のisAdminをセット
    }
  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setProfile((prevProfile) => ({ ...prevProfile, [name]: value }));
  };

  const handlePositionChange = (event) => {
    setProfile((prevProfile) => ({
      ...prevProfile,
      positionId: event.target.value,
    }));
  };

  const handleProjectChange = (event) => {
    setProfile((prevProfile) => ({
      ...prevProfile,
      projectId: event.target.value,
    }));
  };

  const handleRoleChange = (event) => {
    setProfile((prevProfile) => ({
      ...prevProfile,
      roleId: event.target.value,
    }));
  };

  const handleImageFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
        setImageBinary(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    const formData = new FormData();
    formData.append("image", imageBinary);
    formData.append("name", profile.name);
    formData.append("email", profile.email);
    formData.append("password", profile.password);
    formData.append("positionId", profile.positionId);
    formData.append("projectId", profile.projectId);
    formData.append("roleId", profile.roleId); // 追加: 権限IDをフォームデータに追加
    formData.append("hometown", profile.hometown);
    formData.append("birthDate", profile.birthDate);
    formData.append("hobbies", profile.hobbies);

    fetch("/api/upload", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("アップロード成功:", data);
        // ここで必要に応じて状態を更新
      })
      .catch((error) => {
        console.error("アップロード失敗:", error);
      });
  };

  return (
    <Box display="flex" padding={3}>
      <Box marginRight={3}>
        <Avatar
          alt={profile.name}
          src={image}
          sx={{
            width: 200,
            height: 200,
            border: "3px solid #1976d2",
            boxShadow: 3,
          }}
        />
        {isEditing && (
          <Box display="flex" justifyContent="center" mt={2}>
            <Button
              component="label"
              role={undefined}
              variant="contained"
              tabIndex={-1}
              startIcon={<AddAPhotoIcon />}
            >
              画像を選択
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={handleImageFileChange}
              />
            </Button>
          </Box>
        )}
      </Box>

      <Card variant="outlined" sx={{ flex: 1, boxShadow: 3 }}>
        <CardHeader
          title={isNewUser ? "新規ユーザー登録" : "Profile"}
          subheader={
            isNewUser
              ? "必要な情報を入力してください"
              : "The information can be edited"
          }
          action={
            isAdmin &&
            !isNewUser && (
              <Box display="flex" alignItems="center">
                <Typography variant="body2" sx={{ marginRight: 1 }}>
                  {isEditing ? "編集モード" : "閲覧モード"}
                </Typography>
                <Switch
                  checked={isEditing}
                  onChange={() => setIsEditing(!isEditing)}
                  color="primary"
                />
              </Box>
            )
          }
        />
        <Divider />
        <CardContent>
          <Box>
            <Typography variant="h6">基本情報</Typography>
            <Divider />
            <Box display="flex" flexDirection="column" mt={2}>
              {isNewUser && (
                <>
                  <FormControl fullWidth margin="normal">
                    <InputLabel>メールアドレス</InputLabel>
                    <OutlinedInput
                      value={profile.email}
                      label="メールアドレス"
                      name="email"
                      onChange={handleInputChange}
                      readOnly={!isEditing}
                    />
                  </FormControl>

                  <FormControl fullWidth margin="normal">
                    <InputLabel>パスワード</InputLabel>
                    <OutlinedInput
                      type="password"
                      value={profile.password}
                      label="パスワード"
                      name="password"
                      onChange={handleInputChange}
                      readOnly={!isEditing}
                    />
                  </FormControl>

                  {/* 権限登録欄の追加 */}
                  {isNewUser && (
                    <FormControl fullWidth margin="normal">
                      <InputLabel>権限</InputLabel>
                      <Select
                        value={profile.roleId}
                        onChange={handleRoleChange}
                        label="権限"
                        disabled={!isEditing}
                      >
                        {roles.map((role) => (
                          <MenuItem key={role.id} value={role.id}>
                            {role.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                </>
              )}
              <Box display="flex" justifyContent="space-between">
                <FormControl fullWidth margin="normal" sx={{ mr: 1 }}>
                  <InputLabel>名前</InputLabel>
                  <OutlinedInput
                    value={profile.name}
                    label="名前"
                    name="name"
                    onChange={handleInputChange}
                    readOnly={!isEditing}
                  />
                </FormControl>

                <FormControl fullWidth margin="normal" sx={{ ml: 1 }}>
                  <InputLabel>所属</InputLabel>
                  <Select
                    value={profile.positionId}
                    onChange={handlePositionChange}
                    label="所属"
                    disabled={!isEditing}
                  >
                    {positions.map((position) => (
                      <MenuItem key={position.id} value={position.id}>
                        {position.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

              {/* <Box display="flex" justifyContent="space-between">
                <FormControl fullWidth margin="normal" sx={{ mr: 1 }}>
                  <InputLabel>案件名</InputLabel>
                  <Select
                    value={profile.projectId}
                    onChange={handleProjectChange}
                    label="案件名"
                    disabled={!isEditing}
                  >
                    {projects.map((project) => (
                      <MenuItem key={project.id} value={project.id}>
                        {project.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl> */}

                {/* <FormControl fullWidth margin="normal" sx={{ ml: 1 }}>
                  <InputLabel>出身地</InputLabel>
                  <OutlinedInput
                    value={profile.hometown}
                    label="出身地"
                    name="hometown"
                    onChange={handleInputChange}
                    readOnly={!isEditing}
                  />
                </FormControl>
              </Box> */}

              <Box display="flex" justifyContent="space-between">
                <FormControl fullWidth margin="normal" sx={{ mr: 1 }}>
                  <InputLabel>誕生日</InputLabel>
                  <OutlinedInput
                    value={profile.birthDate}
                    label="誕生日"
                    name="birthDate"
                    onChange={handleInputChange}
                    readOnly={!isEditing}
                  />
                </FormControl>

                <FormControl fullWidth margin="normal" sx={{ ml: 1 }}>
                  <InputLabel>趣味</InputLabel>
                  <OutlinedInput
                    value={profile.hobbies}
                    label="趣味"
                    name="hobbies"
                    onChange={handleInputChange}
                    readOnly={!isEditing}
                  />
                </FormControl>
              </Box>
            </Box>
          </Box>
        </CardContent>
        <Divider />
        {isEditing && (
          <Box display="flex" justifyContent="flex-end" p={2}>
            <Button variant="contained" onClick={handleSubmit}>
              保存
            </Button>
          </Box>
        )}
      </Card>
    </Box>
  );
};

export default UserProfile;
