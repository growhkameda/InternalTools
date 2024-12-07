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
  styled
} from "@mui/material";
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import { jwtDecode } from "jwt-decode";
import { useParams } from "react-router-dom";


const people = [
  {
    id: 1,
    name: "加藤 真太郎",
    department_id: [1],
    department_name: ["CEO"],
    position: "CEO_1",
    birthday: "11/10",
    hobby: "サウナ、読書、筋トレ",
    image: "/profile/1.jpg",
  },
  {
    id: 2,
    name: "杁本 翔太",
    department_id: [14],
    department_name: ["ITソリューション事業部"],
    position: "ITソリューション事業部_3",
    birthday: "9/24",
    hobby: "野球",
    image: "/profile/2.jpg",
  },
  {
    id: 3,
    name: "舟橋 大裕",
    department_id: [7],
    department_name: ["人事"],
    position: "",
    birthday: "4/11",
    hobby: "菅原圭のおっかけ",
    image: "/profile/3.jpg",
  },
  {
    id: 4,
    name: "中野 孝平",
    department_id: [7],
    department_name: ["人事"],
    position: "",
    birthday: "6/21",
    hobby:
      "散歩、歴史、酒、ダーツ、水泳、スノボ、中華巡り、サーフィン、バイク、旅行、アニメ",
      image: "/profile/4.png",
  },
  {
    id: 5,
    name: "白石 和樹",
    department_id: [13],
    department_name: ["倉庫課"],
    position: "倉庫課_4",
    birthday: "7/15",
    hobby: "サウナ、お酒、野球",
    image: "/profile/5.JPG",
  },
  {
    id: 6,
    name: "雨宮 裕樹",
    department_id: [20],
    department_name: ["リスキリング事業部"],
    position: "リスキリング事業部_3",
    birthday: "7/15",
    hobby: "ゲーム、スノボ",
    image: "/profile/6.jpg",
  },
  {
    id: 7,
    name: "工藤 さよ子",
    department_id: [3],
    department_name: ["総務"],
    position: "",
    birthday: "8/16",
    hobby: "ご飯とお酒、ASMR視聴、韓国",
    image: "/profile/7.jpg",
  },
  {
    id: 8,
    name: "辻戸 翔希",
    department_id: [19, 22],
    department_name: ["ITサポート課", "技術向上課"],
    position: "ITサポート課_5",
    birthday: "7/2",
    hobby: "麻雀、ダーツ、ライブ",
    image: "/profile/8.png",
  },
  {
    id: 9,
    name: "柘植 航太",
    department_id: [18, 22],
    department_name: ["評価検証課", "技術向上課"],
    position: "評価検証課_5",
    birthday: "1/13",
    hobby: "弾き語り、麻雀",
    image: "/profile/9.jpg",
  },
  {
    id: 10,
    name: "吉川 翔",
    department_id: [19],
    department_name: ["ITサポート課"],
    position: "ITサポート課_5",
    birthday: "8/28",
    hobby: "麻雀、ダーツ、スノボ",
    image: "/profile/10.jpg",
  },
  {
    id: 11,
    name: "山下 暁大",
    department_id: [17, 21],
    department_name: ["開発課", "TechGrowUp課"],
    position: "TechGrowUp課_4",
    birthday: "12/13",
    hobby: "ダイビング、ゲーム、爬虫類、ミュージカル、バイク、漫画",
    image: "/profile/11.jpg",
  },
  {
    id: 12,
    name: "武藤 秀平",
    department_id: [17, 22],
    department_name: ["開発課", "技術向上課"],
    position: "",
    birthday: "7/24",
    hobby: "キャンプ、スノボ",
    image: "/profile/12.jpg",
  },
  {
    id: 13,
    name: "馬場 友規",
    department_id: [18],
    department_name: ["評価検証課"],
    position: "評価検証課_5",
    birthday: "8/10",
    hobby: "バイク、カメラ",
    image: "/profile/13.jpg",
  },
  {
    id: 14,
    name: "亀田 春樹",
    department_id: [17, 22],
    department_name: ["開発課", "技術向上課"],
    position: "技術向上課_4",
    birthday: "4/20",
    hobby: "ゲーム、バスケ、野球",
    image: "/profile/14.png",
  },
];

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

  const { id } = useParams();

  const getProfile = (id) =>{
    let returnProfile = {}
    people.forEach(item => {
      if(item.id === id) {
        returnProfile = item
        return
      }
    })
    return returnProfile
  }

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
  const [profile, setProfile] = useState(getProfile(Number(id)));
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

  const StyledCard = styled(Card)(({ theme }) => ({
    padding: '0.2em 0.5em',
    margin: '2em 0',
    background: '#d6ebff',
    boxShadow: '0px 0px 0px 10px #d6ebff',
    border: 'dashed 2px white',
    borderRadius: '8px',
    '& p': {
      margin: 0,
      padding: 0,
    },
  }));

  return (
    <Box 
      display="flex" 
      padding={3}
      sx={{ 
        backgroundImage: 'url(https://image.en-gage.net/image/work_picture/481922/16802414219493benv.jpg?width=573)',
        backgroundSize: 'cover', // 画像を全体にカバーする
        backgroundPosition: 'center', // 中央に配置
        // minHeight: '100vh', // ビューポート全体の高さに設定
      }}
    >
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

      <StyledCard variant="outlined" sx={{ flex: 1, boxShadow: 3 }}>
        <CardHeader
          title={isNewUser ? "新規ユーザー登録" : "Profile"}
          subheader={
            isNewUser
              ? "必要な情報を入力してください"
              : ""
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
                  {/* <Select
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
                  </Select> */}
                  <OutlinedInput
                    value={profile.department_name}
                    label="所属"
                    name="department"
                    onChange={handleInputChange}
                    readOnly={!isEditing}
                  />
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
                    value={profile.birthday}
                    label="誕生日"
                    name="birthday"
                    onChange={handleInputChange}
                    readOnly={!isEditing}
                  />
                </FormControl>

                <FormControl fullWidth margin="normal" sx={{ ml: 1 }}>
                  <InputLabel>趣味</InputLabel>
                  <OutlinedInput
                    value={profile.hobby}
                    label="趣味"
                    name="hobby"
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
      </StyledCard>
    </Box>
  );
};

export default UserProfile;
