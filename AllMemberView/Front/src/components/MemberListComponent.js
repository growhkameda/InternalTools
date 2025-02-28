import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Button,
  Card,
  CardMedia,
  CardContent,
  Typography,
  TextField,
  CardActionArea,
  InputAdornment,
  useMediaQuery,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Grid from "@mui/material/Grid2";

const Icon = ({ num }) => {
  let text;
  if (num === 1) {
    text = "CEO";
  } else if (num === 3) {
    text = "部長";
  } else if (num === 4) {
    text = "課長";
  } else if (num === 5) {
    text = "リーダー";
  }
  return (
    <Typography
      variant="h12"
      component="div"
      sx={{
        fontWeight: "bold",
        color: "#ffffff", // 文字色を白に設定
        textAlign: "center",
        fontFamily: "Arial",
        backgroundColor: "#4caf50", // 背景を緑に設定 (MUIのgreen[500]色)
        borderRadius: "8px", // 角を少し丸く
        border: "2px solid #ffffff", // 白い罫線を追加
      }}
    >
      {text}
    </Typography>
  );
};

const getDisplayMember = (memberList) => {
  // 役職のある部署が上にくるようにソート
  memberList.forEach((item) => {
    item.department.sort((a, b) => {
      if (a.positionId === null && b.positionId !== null) {
        return 1; // aがnullならbを上に
      } else if (a.positionId !== null && b.positionId === null) {
        return -1; // bがnullならaを上に
      } else if (a.positionId === null && b.positionId === null) {
        return 0; // 両方nullなら順序を変えない
      }
      return a.positionId - b.positionId; // 両方positionIdがある場合は値が小さい方を上に
    });
  });

  // 役職がある人が先にくるようにソート
  memberList.sort((a, b) => {
    const aPositionIds = a.department
      .map((dep) => dep.positionId)
      .filter((id) => id !== null);
    const bPositionIds = b.department
      .map((dep) => dep.positionId)
      .filter((id) => id !== null);

    if (aPositionIds.length === 0 && bPositionIds.length === 0) {
      return 0; // 両方ともpositionIdがない場合はそのまま
    } else if (aPositionIds.length === 0) {
      return 1; // aがpositionIdを持っていない場合は後ろに
    } else if (bPositionIds.length === 0) {
      return -1; // bがpositionIdを持っていない場合は後ろに
    } else {
      // 両方ともpositionIdがある場合は小さい方を前に
      return Math.min(...aPositionIds) - Math.min(...bPositionIds);
    }
  });

  return memberList;
};

const alluserInfo = async () => {
  let responseData = [];

  let getMemberUrl = "";
  const envType = process.env.REACT_APP_ENV_TYPE;
  if (envType === "stg") {
    getMemberUrl = "http://" + process.env.REACT_APP_MY_IP + "/api/alluserinfo";
  } else {
    getMemberUrl = "http://localhost:8080/allmemberview/api/alluserinfo";
  }

  try {
    // トークンを取得する
    const token = localStorage.getItem("token"); // 例: ローカルストレージに保存されたトークンを取得

    // トークンをAuthorizationヘッダーに追加してリクエストを送信
    const response = await axios.get(getMemberUrl, {
      headers: {
        Authorization: `Bearer ${token}`, // Bearerトークンとして設定
      },
    });

    if (response.data) {
      responseData = response.data;
    }
  } catch (err) {
    console.error("Login error", err);
  }
  return responseData;
};

const departmentUserInfo = async (departmentIds) => {
  let responseData = [];

  let getMemberUrl = "";
  const envType = process.env.REACT_APP_ENV_TYPE;
  if (envType === "stg") {
    getMemberUrl =
      "http://" + process.env.REACT_APP_MY_IP + "/api/department-users";
  } else {
    getMemberUrl = "http://localhost:8080/allmemberview/api/department-users";
  }

  try {
    // トークンを取得する
    const token = localStorage.getItem("token"); // 例: ローカルストレージに保存されたトークンを取得

    // トークンをAuthorizationヘッダーに追加してリクエストを送信
    const response = await axios.post(
      getMemberUrl,
      {
        departmentIdList: departmentIds,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`, // Bearerトークンとして設定
        },
      }
    );

    if (response.data) {
      responseData = response.data;
    }
  } catch (err) {
    console.error("Login error", err);
  }
  return responseData;
};

const imagePath = (fileName) => {
  return "/profile/" + fileName;
};

const PeopleList = ({ idList }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [people, setPeople] = useState([]); // 人情報を管理するステート
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 20; // 4×5のレイアウト
  const navigate = useNavigate(); // useNavigateフックを使用

  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("sm")); // モバイル判定

  // コンポーネントの初期レンダリング時にユーザー情報を取得
  useEffect(() => {
    const fetchData = async () => {
      // 部署に紐づくすべての社員情報を取得
      if (idList) {
        setPeople(await departmentUserInfo(idList));
      }
      // すべての社員情報を取得
      else {
        setPeople(await alluserInfo());
      }
    };
    fetchData();
  }, []);

  //表示するメンバー
  const { id } = useParams();
  let displayMember = getDisplayMember(people);

  // フリーワード検索
  const filteredPeople = displayMember.filter(
    (data) =>
      data.user.userName.includes(searchTerm) ||
      data.department.some((department) =>
        department.departmentName.includes(searchTerm)
      )
  );

  // 現在のページに表示するデータを取得
  const displayedPeople = filteredPeople.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  // 次のページに進む関数
  const handleNextPage = () => {
    if ((currentPage + 1) * itemsPerPage < filteredPeople.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  // 前のページに戻る関数
  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  // 社員詳細ページに遷移する関数
  const handleCardClick = (userid) => {
    navigate(`/user/${userid}`); // クリックされた社員の詳細ページに遷移
  };

  return (
    <Grid
      container
      sx={{
        padding: 2,
        backgroundSize: "cover", // 画像を全体にカバーする
        backgroundPosition: "center", // 中央に配置
        minHeight: "100vh", // ビューポート全体の高さに設定
      }}
    >
      {/* フリーワード検索用のテキストフィールド、虫眼鏡マーク付き */}
      <TextField
        label="検索"
        variant="outlined"
        fullWidth
        sx={{
          marginBottom: 2,
          backgroundColor: "white", // 背景色を白に設定
        }}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        InputProps={{
          shrink: true,
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />

      {/* レスポンシブなレイアウト */}
      <Grid container spacing={2}>
        {displayedPeople.map((person) => (
          // スマホは1列(xs) スマホより大きい画面は2列 PCは3列
          <Grid sise={{xs:12, sm:6,  md:3, lg:3, xl:3}}
            key={person.user.userId}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Card
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "transparent",
                boxShadow: "none",
              }}
            >
              <CardActionArea
                onClick={() => handleCardClick(person.user.userId)}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100%",
                  padding: { xs: 4, sm: 2, md: 3 }, 
                }}
              >
                <CardMedia
                  component="img"
                  image={imagePath(person.user.image)}
                  alt={person.user.userName}
                  sx={{
                    width: {xs:300, sm:200},
                    height: {xs:300, sm:200},
                    margin: 1,
                  }}
                />
                <CardContent>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: "bold", textAlign: "center" }}
                  >
                    {person.user.userName}
                  </Typography>
                  {person.department.map((department, index) => (
                    <Box
                      key={index}
                      sx={{ display: "flex", alignItems: "center" }}
                    >
                      {department.positionId && (
                        <Icon
                          num={Number(department.positionId)}
                          sx={{ ml: 1 }}
                        />
                      )}
                      <Typography
                        variant="subtitle1"
                        sx={{ fontSize: "0.7rem", textAlign: "center" }}
                      >
                        {department.departmentName}
                      </Typography>
                    </Box>
                  ))}
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* ページ移動ボタン */}
      <Grid
        sx={{ display: "flex", justifyContent: "space-between", margin: 2 }}
      >
        <Button
          variant="contained"
          onClick={handlePreviousPage}
          disabled={currentPage === 0}
        >
          前へ
        </Button>
        <Button
          variant="contained"
          onClick={handleNextPage}
          disabled={(currentPage + 1) * itemsPerPage >= filteredPeople.length}
        >
          次へ
        </Button>
      </Grid>
    </Grid>
  );
};

export default PeopleList;
