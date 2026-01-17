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
  DELETE_DEPARTMENT_NAME
} from "../common/Const";

const Icon = ({ num }) => {
  let iconImage = null;
  if (num === 1) {
    iconImage = "/icons/ceo.png"
  } else if (num === 3) {
    iconImage = "/icons/manager.png"
  } else if (num === 4) {
    iconImage = "/icons/department.png"
  } else if (num === 5) {
    iconImage = "/icons/leader.png"
  }
  return (
    <Box
      component="img"
      src={iconImage}
      sx={{
        width: { xs: 15, md: 15 }, 
        height: { xs: 25, md: 25 },
      }}
    />
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

const getDisplayUser = async (actionView, bodyValue, navigate, birthdayMonth ) => {
  let responseData = [];
  let getUserUrl = "";
  const envType = process.env.REACT_APP_ENV_TYPE;

  if (actionView === ACTIONVIEW_ALL_USER) {
    if (envType === "stg") {
      getUserUrl = process.env.REACT_APP_MY_IP + "alluserinfo";
    } else {
      getUserUrl = "http://localhost:8080/allmemberview/api/alluserinfo";
    }

    responseData = await httpRequestUtil(getUserUrl, null, "GET");
  } else if (actionView === ACTIONVIEW_DEPARTMENT_USER) {
    if (envType === "stg") {
      getUserUrl = process.env.REACT_APP_MY_IP + "department-users";
    } else {
      getUserUrl = "http://localhost:8080/allmemberview/api/department-users";
    }

    let body = {
      departmentIdList: bodyValue,
    };

    responseData = await httpRequestUtil(getUserUrl, body, "POST");
  } else if (actionView === ACTIONVIEW_BIRTHDAY_USER) {
    if (envType === "stg") {
      getUserUrl = process.env.REACT_APP_MY_IP + "birthuserinfo";
    } else {
      getUserUrl = "http://localhost:8080/allmemberview/api/birthuserinfo";
    }

    if(birthdayMonth){
      getUserUrl += `?month=${birthdayMonth}`;
    }

    responseData = await httpRequestUtil(getUserUrl, null, "GET");
  } else if (actionView === ACTIONVIEW_JOINMONTH_USER) {
    if (envType === "stg") {
      getUserUrl = process.env.REACT_APP_MY_IP +"users-by-newEmployee?joiningMonth=" + getCurrentJoiningMonth();
    } else {
      getUserUrl = "http://localhost:8080/allmemberview/api/users-by-newEmployee?joiningMonth=" + getCurrentJoiningMonth();
    }

    try {
      responseData = await httpRequestUtil(getUserUrl, null, "GET");
    } catch(err) {
      localStorage.removeItem("token");
      alert("エラーが発生しました。ログインからやり直してください");
      navigate("/");
    }
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

const sortDates = (userList) => {
  let tmpDataList = [...userList];
  tmpDataList.sort((a,b) => {
      const [monthA, dayA] = a.user.birthDate.split('/').map(Number);
      const [monthB, dayB] = b.user.birthDate.split('/').map(Number);

    // 月と日を比較してソート
    if (monthA !== monthB) {
      return monthA - monthB;  // 月でソート
    } else {
      return dayA - dayB;  // 同じ月の場合、日でソート
    }
  });
  return tmpDataList;
};

const makeUserInfoCard = (
  userInfoList,
  imagePath,
  handleImageLoad,
  handleCardClick,
  gridSize,
  imageSizeWidth,
  imageSizeHeight,
  textSize,
  textSubSize,
  actionView
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
        minWidth:imageSizeWidth,
        minHeight:imageSizeHeight,
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
            onLoad={handleImageLoad}
            alt={person.user.userName}
            sx={{
              width: imageSizeWidth,
              height: imageSizeHeight
            }}
          />

          {/* カードに記載される内容を設定 */}
          <CardContent sx={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
            {/* 社員の名前を表示 */}
            <Typography
              variant="h6"
              sx={{fontSize:textSize, fontWeight: "bold", textAlign: "center"}}
            >
              {person.user.userName}
            </Typography>

            {actionView === ACTIONVIEW_BIRTHDAY_USER ? (
              <>
                {/* 社員の誕生日を表示 */}
                <Typography variant="subtitle" sx={{fontSize:textSubSize, textAlign: "center"}}>
                  {person.user.birthDate}
                </Typography>
              </>
            ) : actionView === ACTIONVIEW_JOINMONTH_USER ? (
              <>
                {/* 社員の部署情報を表示 */}
                {person.department.map((department, index) => (
                    <Typography variant="subtitle" sx={{ fontSize:textSubSize}}>
                      {department.departmentName.replace(DELETE_DEPARTMENT_NAME, "")}
                    </Typography>
                ))}
              </>
            ) : (
              <>
                {/* 社員の部署情報を表示 */}
                {person.department.map((department, index) => (
                  <Box
                    key={index}
                    sx={{ display: "flex", alignItems: "center" }}
                  >
                    {/* 社員の役職にあったアイコンを表示 */}
                    {department.positionId && (
                      <Icon
                        num={Number(department.positionId)}
                      />
                    )}

                    {/* 社員の部署名を表示 */}
                    <Typography
                      variant="subtitle1"
                      sx={{ fontSize:textSubSize }}
                    >
                      {department.departmentName.replace(DELETE_DEPARTMENT_NAME, "")}
                    </Typography>
                  </Box>
                ))}
              </>
            )}
          </CardContent>
        </CardActionArea>
      </Card>
    </Grid2>
  ));
};

const UserList = ({ actionView, bodyValue, birthdayMonth }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [userList, setDisplayUser] = useState([]); // 人情報を管理するステート
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 20; // 4×5のレイアウト
  const navigate = useNavigate(); // useNavigateフックを使用
  const [loading, setLoading] = useState(true); // 画像のローディング状態を管理

  const handleImageLoad = () => {
    setLoading(false); // 画像が読み込まれたらローディング状態をfalseに
  };

  // コンポーネントの初期レンダリング時にユーザー情報を取得
  useEffect(() => {
    const fetchData = async () => {
      // トークンがない場合、ログイン画面にリダイレクト
      const token = localStorage.getItem('token');
      if (!token) {
        navigate("/")
        return
      }
      setDisplayUser(await getDisplayUser(actionView, bodyValue, navigate, birthdayMonth));
    };
    fetchData();
  }, [actionView, bodyValue, birthdayMonth, navigate]);

  // 表示するユーザを役職がある人順にソート
  let sortedDisplayUser = sortDisplayUser(userList);
  let sortedBirthDateUser = sortDates(userList);

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
    handleImageLoad,
    handleCardClick,
    cardProps,
    imageSizeWidth,
    imageSizeHeight,
    textSize,
    textSubSize,
    actionView,
  }) => {
    return (
      <Grid2
        container
        spacing={users.length === 1 ? 0 : 2} // ユーザーが1人だけの場合はspacingを0に
        sx={{
          justifyContent: "flex-start", // カードを中心に配置
          alignItems: "flex-start", // 上寄せ
          flexWrap: "wrap", // 折り返しを有効にする
          margin: 2,
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
            handleImageLoad,
            handleCardClick,
            cardProps,
            imageSizeWidth,
            imageSizeHeight,
            textSize,
            textSubSize,
            actionView
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
        sx={{ display: "flex", justifyContent: "space-between", margin: 2, width:"100%" }}
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
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        margin: 1,
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
              margin: 2,
              backgroundColor: "white",
            }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            input={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          {/* 人数分の社員情報一覧のカードを作成 */}
          {loading && <p>Loading...</p>} {/* ローディング中のインジケーター */}
          <UserCardList
            users={displayedPeople}
            imagePath={imagePath}
            handleImageLoad={handleImageLoad}
            handleCardClick={handleCardClick}
            cardProps={{ xs: 4, sm: 2}}
            imageSizeWidth={{ xs: 90, sm: 120}}
            imageSizeHeight={{ xs: 110, sm: 140}}
            textSize={{xs:"10px", sm:"14px"}}
            textSubSize={{xs:"8px", sm:"12px"}}
            actionView={actionView}
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
            users={sortedBirthDateUser}
            imagePath={imagePath}
            handleCardClick={handleCardClick}
            cardProps={{ xs: 4, sm: 3 }}
            imageSizeWidth={{ xs: 80, sm: 100}}
            imageSizeHeight={{ xs: 100, sm: 120}}
            textSize={"9px"}
            textSubSize={"9px"}
            actionView={actionView}
          />
        </>
      )}
    </Grid2>
  );
};

export default UserList;
