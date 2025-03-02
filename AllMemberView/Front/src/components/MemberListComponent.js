import React, { useEffect, useState } from "react";
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
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";
import Grid2 from "@mui/material/Grid2";
import { httpRequestUtil } from "../common/Utils";
import {
  ACTIONVIEW_ALL_USER,
  ACTIONVIEW_DEPARTMENT_USER,
  ACTIONVIEW_BIRTHDAY_USER,
  ACTIONVIEW_JOINMONTH_USER,
} from "../common/Const";

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

// 現在の年月を"yyyy/mm"形式で取得する
const getCurrentJoiningMonth = () => {
  const now = new Date(); // フィルタリング用の変数
  const year = now.getFullYear(); // 現在の年を取得
  const month = now.getMonth() + 1; // 現在の月を取得

  // 月が一桁の場合先頭に0を追加して渡す
  return `${year}/${month < 10 ? "0" + month : month}`;
};

const getDisplayUser = async (actionView, bodyValue) => {
  let responseData = [];
  let getUserUrl = "";
  const envType = process.env.REACT_APP_ENV_TYPE;

  if (actionView === ACTIONVIEW_ALL_USER) {
    if (envType === "stg") {
      getUserUrl = "http://" + process.env.REACT_APP_MY_IP + "/api/alluserinfo";
    } else {
      getUserUrl = "http://localhost:8080/allmemberview/api/alluserinfo";
    }

    responseData = await httpRequestUtil(getUserUrl, null, "GET");
  } else if (actionView === ACTIONVIEW_DEPARTMENT_USER) {
    if (envType === "stg") {
      getUserUrl =
        "http://" + process.env.REACT_APP_MY_IP + "/api/department-users";
    } else {
      getUserUrl = "http://localhost:8080/allmemberview/api/department-users";
    }

    let body = {
      departmentIdList: bodyValue,
    };

    responseData = await httpRequestUtil(getUserUrl, body, "POST");
  } else if (actionView === ACTIONVIEW_BIRTHDAY_USER) {
    if (envType === "stg") {
      getUserUrl =
        "http://" + process.env.REACT_APP_MY_IP + "/api/birthuserinfo";
    } else {
      getUserUrl = "http://localhost:8080/allmemberview/api/birthuserinfo";
    }

    responseData = await httpRequestUtil(getUserUrl, null, "GET");
  } else if (actionView === ACTIONVIEW_JOINMONTH_USER) {
    if (envType === "stg") {
      getUserUrl =
        "http://" +
        process.env.REACT_APP_MY_IP +
        "/api/users-by-newEmployee?joiningMonth=" +
        getCurrentJoiningMonth();
    } else {
      getUserUrl =
        "http://localhost:8080/allmemberview/api/users-by-newEmployee?joiningMonth=" +
        getCurrentJoiningMonth();
    }

    responseData = await httpRequestUtil(getUserUrl, null, "GET");
  }

  return responseData;
};

const sortDisplayUser = (userList) => {
  // 役職のある部署が上にくるようにソート
  userList.forEach((item) => {
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
  userList.sort((a, b) => {
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

  return userList;
};

const makeUserInfoCard = (
  userInfoList,
  imagePath,
  handleCardClick,
  gridSize,
  imageSize
) => {
  return userInfoList.map((person) => (
    // カードのレイアウト設定
    // スマホは1列(xs) スマホより大きい画面は2列 PCは3列
    <Grid2
      size={gridSize}
      key={person.user.userId}
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
      }}
    >
      {/* 一人分の社員情報のカードを作成 */}
      <Card
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          backgroundColor: "transparent",
          boxShadow: "none",
          width: "100%",
        }}
      >
        {/* カードがクリックされた際の動作やエリアの設定 */}
        <CardActionArea
          onClick={() => handleCardClick(person.user.userId)}
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            alignItems: "center",
            height: "100%",
          }}
        >
          {/* カードで表示されるメディアの設定 */}
          <CardMedia
            component="img"
            image={imagePath(person.user.image)}
            alt={person.user.userName}
            sx={{
              width: imageSize,
              height: imageSize,
              margin: 1,
            }}
          />

          {/* カードに記載される内容を設定 */}
          <CardContent>
            {/* 社員の名前を表示 */}
            <Typography
              variant="h6"
              sx={{ fontWeight: "bold", textAlign: "center" }}
            >
              {person.user.userName}
            </Typography>

            {/* 社員の部署情報を表示 */}
            {person.department.map((department, index) => (
              <Box key={index} sx={{ display: "flex", alignItems: "center" }}>
                {/* 社員の役職にあったアイコンを表示 */}
                {department.positionId && (
                  <Icon num={Number(department.positionId)} sx={{ ml: 1 }} />
                )}

                {/* 社員の部署名を表示 */}
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
    </Grid2>
  ));
};

const UserList = ({ actionView, bodyValue }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [userList, setDisplayUser] = useState([]); // 人情報を管理するステート
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 20; // 4×5のレイアウト
  const navigate = useNavigate(); // useNavigateフックを使用

  // コンポーネントの初期レンダリング時にユーザー情報を取得
  useEffect(() => {
    const fetchData = async () => {
      setDisplayUser(await getDisplayUser(actionView, bodyValue));
    };
    fetchData();
  }, []);

  // 表示するユーザを役職がある人順にソート
  let sortedDisplayUser = sortDisplayUser(userList);

  // フリーワード検索
  const filteredUser = sortedDisplayUser.filter(
    (data) =>
      data.user.userName.includes(searchTerm) ||
      data.department.some((department) =>
        department.departmentName.includes(searchTerm)
      )
  );

  // 現在のページに表示するデータを取得
  const displayedPeople = filteredUser.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  // 次のページに進む関数
  const handleNextPage = () => {
    if ((currentPage + 1) * itemsPerPage < filteredUser.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  // 前のページに戻る関数
  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  // 社員の画像情報を表示
  const imagePath = (fileName) => {
    return "/profile/" + fileName;
  };

  // 社員詳細ページに遷移する関数
  const handleCardClick = (userid) => {
    navigate(`/user/${userid}`); // クリックされた社員の詳細ページに遷移
  };

  const UserCardList = ({
    users,
    imagePath,
    handleCardClick,
    cardProps,
    imageSize,
  }) => {
    return (
      <Grid2
        container
        spacing={users.length === 1 ? 0 : 2} // ユーザーが1人だけの場合はspacingを0に
        sx={{
          justifyContent: "center", // カードを中心に配置
          alignItems: "flex-start", // 上寄せ
          flexWrap: "wrap", // 折り返しを有効にする
          gap: 2, // アイテム間の隙間を設定
        }}
      >
        {users.length === 0 ? (
          <Grid2 size={12}>
            <Typography
              variant="h6"
              sx={{ textAlign: "center", color: "gray" }}
            >
              今月はいないよ...
            </Typography>
          </Grid2>
        ) : (
          makeUserInfoCard(
            users,
            imagePath,
            handleCardClick,
            cardProps,
            imageSize
          )
        )}
      </Grid2>
    );
  };

  const PaginationButtons = ({
    handlePreviousPage,
    handleNextPage,
    currentPage,
    itemsPerPage,
    filteredUser,
  }) => {
    return (
      <Grid2
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
          disabled={(currentPage + 1) * itemsPerPage >= filteredUser.length}
        >
          次へ
        </Button>
      </Grid2>
    );
  };

  return (
    <Grid2
      container
      sx={{
        padding: 2,
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "flex-start",
      }}
    >
      {actionView === ACTIONVIEW_ALL_USER ||
      actionView === ACTIONVIEW_DEPARTMENT_USER ? (
        <>
          {/* フリーワード検索用のテキストフィールド、虫眼鏡マーク付き */}
          <TextField
            label="検索"
            variant="outlined"
            fullWidth
            sx={{
              marginBottom: 2,
              backgroundColor: "white",
            }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            Input={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          {/* 人数分の社員情報一覧のカードを作成 */}
          <UserCardList
            users={displayedPeople}
            imagePath={imagePath}
            handleCardClick={handleCardClick}
            cardProps={{ xs: 12, sm: 6, md: 3, lg: 3, xl: 3 }}
            imageSize={{ xs: 250, md: 300 }}
          />
          {/* 1Pに20人表示するため次の20人や前の20人を表示するためのボタン表示 */}
          <PaginationButtons
            handlePreviousPage={handlePreviousPage}
            handleNextPage={handleNextPage}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            filteredUser={filteredUser}
          />
        </>
      ) : (
        <>
          {/* 人数分の社員情報一覧のカードを作成 */}
          <UserCardList
            users={sortedDisplayUser}
            imagePath={imagePath}
            handleCardClick={handleCardClick}
            cardProps={{ xs: 12, sm: 6 }}
            imageSize={{ xs: 100, sm: 200 }}
          />
        </>
      )}
    </Grid2>
  );
};

export default UserList;
