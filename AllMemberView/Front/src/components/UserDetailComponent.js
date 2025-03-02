import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  FormControl,
  OutlinedInput,
  Avatar,
  Switch,
  Typography,
  styled,
} from "@mui/material";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import { useParams, useNavigate } from "react-router-dom";
import { httpRequestUtil } from "../common/Utils";
import Grid2 from "@mui/material/Grid2";

// カスタムスタイル
const StyledCard = styled(Card)({
  padding: "0.2em 0.5em",
  margin: "2em 0",
  background: "#d6ebff",
  boxShadow: "0px 0px 0px 10px #d6ebff",
  border: "dashed 2px white",
  borderRadius: "8px",
});

const imagePath = (fileName) => {
  return "/profile/" + fileName;
};

const UserProfile = ({ isAdmin }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDeleted, setIsDeleted] = useState(false); // 削除状態

  const getUrl = () => {
    const envType = process.env.REACT_APP_ENV_TYPE;
    let getUserUrl = "";
    if (envType === "stg") {
      getUserUrl = "http://" + process.env.REACT_APP_MY_IP + `api/user/${id}`;
    } else {
      getUserUrl = `http://localhost:8080/allmemberview/api/user/${id}`;
    }
    return getUserUrl;
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        let responseData = [];

        responseData = await httpRequestUtil(getUrl(), null, "GET");
        setProfile(responseData);
        setImage(responseData.user.image);
      } catch (err) {
        console.error("ユーザー情報取得エラー:", err);
        setError("ユーザー情報を取得できませんでした。");
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [id]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setProfile((prevProfile) => ({
      ...prevProfile,
      user: {
        ...prevProfile.user,
        [name]: value,
      },
    }));
  };

  const handleImageFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      if (image) {
        formData.append("image", image);
      }
      formData.append("userName", profile.user.userName);
      formData.append("birthDate", profile.user.birthDate);
      formData.append("hobby", profile.user.hobby);
      formData.append("joiningMonth", profile.user.joiningMonth);

      await httpRequestUtil(getUrl(), formData, "PUT");

      alert("プロフィールが更新されました！");
      setIsEditing(false);
    } catch (err) {
      console.error("更新エラー:", err);
      alert("プロフィールの更新に失敗しました。");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("本当に削除していいですか？")) return;

    try {
      await httpRequestUtil(getUrl(), null, "DELETE");

      // 削除成功後の処理
      setIsDeleted(true);
    } catch (err) {
      console.error("削除エラー:", err);
      alert("ユーザーの削除に失敗しました。");
    }
  };

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  if (isDeleted) {
    // 削除成功後の表示
    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="100vh"
      >
        <Typography variant="h5" color="error" gutterBottom>
          削除が完了しました
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/dashboard")} // ユーザー一覧ページへの遷移
        >
          ユーザー一覧に戻る
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ padding: 3, backgroundSize: "cover", backgroundPosition: "center" }}>
      <Grid2 container spacing={3} justifyContent="center">
        {/* 画像 */}
        <Grid2 xs={12} md={3} display="flex" justifyContent="center">
          <Box>
            <Avatar
              alt={profile.user.userName}
              src={imagePath(profile.user.image)}
              sx={{
                width: 200,
                height: 200,
                border: "3px solid #1976d2",
                boxShadow: 3,
              }}
            />
            {isEditing && (
              <Box display="flex" justifyContent="center" mt={2}>
                <Button component="label" variant="contained" startIcon={<AddAPhotoIcon />}>
                  画像を選択
                  <input type="file" accept="image/*" hidden onChange={handleImageFileChange} />
                </Button>
              </Box>
            )}
          </Box>
        </Grid2>
  
        {/* プロフィール部分 */}
        <Grid2 xs={12} md={9}>
          <StyledCard variant="outlined" sx={{ boxShadow: 3 }}>
            <CardHeader
              title="ユーザー詳細"
              action={
                isAdmin && (
                  <Box display="flex" alignItems="center">
                    <Typography variant="body2" sx={{ marginRight: 1 }}>
                      {isEditing ? "編集モード" : "閲覧モード"}
                    </Typography>
                    <Switch checked={isEditing} onChange={() => setIsEditing(!isEditing)} color="primary" />
                  </Box>
                )
              }
            />
            <Divider />
            <CardContent>
              {/* 名前 */}
              <Box display="flex" alignItems="center" mb={2}>
                <Typography sx={{ width: "80px" }}>名前</Typography>
                <FormControl fullWidth>
                  <OutlinedInput value={profile.user.userName} name="userName" onChange={handleInputChange} readOnly={!isEditing} />
                </FormControl>
              </Box>
  
              {/* 入社月 */}
              <Box display="flex" alignItems="center" mb={2}>
                <Typography sx={{ width: "80px" }}>入社月</Typography>
                <FormControl fullWidth>
                  <OutlinedInput value={profile.user.joiningMonth} name="joiningMonth" onChange={handleInputChange} readOnly={!isEditing} />
                </FormControl>
              </Box>
  
              {/* 部署 */}
              <Box display="flex" alignItems="center" mb={2}>
                <Typography sx={{ width: "80px" }}>部署</Typography>
                <FormControl fullWidth>
                  <OutlinedInput value={profile.department.map((dep) => dep.departmentName).join(", ")} readOnly />
                </FormControl>
              </Box>
  
              {/* 誕生日 */}
              <Box display="flex" alignItems="center" mb={2}>
                <Typography sx={{ width: "80px" }}>誕生日</Typography>
                <FormControl fullWidth>
                  <OutlinedInput value={profile.user.birthDate} name="birthDate" onChange={handleInputChange} readOnly={!isEditing} />
                </FormControl>
              </Box>
  
              {/* 趣味 */}
              <Box display="flex" alignItems="center" mb={2}>
                <Typography sx={{ width: "80px" }}>趣味</Typography>
                <FormControl fullWidth>
                  <OutlinedInput value={profile.user.hobby} name="hobby" onChange={handleInputChange} readOnly={!isEditing} />
                </FormControl>
              </Box>
            </CardContent>
            {isEditing && (
              <Box display="flex" justifyContent="flex-end" p={2}>
                <Button variant="contained" onClick={handleSubmit} sx={{ marginRight: 2 }}>保存</Button>
                <Button variant="contained" color="error" onClick={handleDelete}>削除</Button>
              </Box>
            )}
          </StyledCard>
        </Grid2>
      </Grid2>
    </Box>
  );
  
};

export default UserProfile;
