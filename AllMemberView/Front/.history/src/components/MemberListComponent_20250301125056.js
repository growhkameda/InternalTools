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
  useMediaQuery
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";
import axios from "axios";

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

const getDisplayMember = (id, memberList) => {

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

// 指定入社月の社員をフィルタリングして表示する(getEmployeesByJoinMonthとあるが試験的にuserIdでフィルタリングする)
const getEmployeesByJoinMonth = async (userId) => {   //DB実装後引数をjoiningMonth(おそらくこの命名)に変更
  let responseData = [];  // サーバーからのレスポンスデータの格納用
  let getMemberUrl = "";  // 取得した社員情報のURLの格納用

  const envType = process.env.REACT_APP_ENV_TYPE; //  環境変数を格納
  //環境変数がstgなら
  if (envType === "stg") {
    getMemberUrl =
      "http://" + process.env.REACT_APP_MY_IP + "/api/users-by-newEmployee?userId=" + userId; //DB実装後引数をjoiningMonth(おそらくこの命名)に変更
  } else {
    getMemberUrl =
      "http://localhost:8080/allmemberview/api/users-by-newEmployee?userId=" + userId;        //DB実装後引数をjoiningMonth(おそらくこの命名)に変更
  }

  // 認証トークンの取得とBearer認証付きAPIリクエストの試行処理
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(getMemberUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    //オブジェクトにdateプロパティがある場合、その値をresponseDateに格納
    if (response.data) {
      responseData = response.data;
    }
  } catch (err) {
    console.error("API error", err);
  }
  return responseData;
};

/*
  alluserInfoとgetEmployeesByJoinMonthを切り替えられるようにfetchModeを作成(初期値はjoinMonth)
  fetchModeのステートは、  
    "all"       : 全社員を取得するalluserInfoを使用
    "joinMonth" : 指定した入社年月を取得するgetEmployeesByJoinMonthを使用
*/
const PeopleList = ({fetchMode = "joinMonth", userId: propUserId}) => {   //fetchModeのjoinMonthを初期値として設定
  const [userId, setUserId] = useState(               //fecthModeが"joinMonth"の場合、propUserId(無ければ1)を設定, "all"の場合userIdを使用せずnullに設定
    fetchMode === "joinMonth" ? (propUserId !== undefined ? propUserId : 1) : null
  );    
  const [searchTerm, setSearchTerm] = useState("");
  const [people, setPeople] = useState([]);           // 人情報を管理するステート
  const [currentPage, setCurrentPage] = useState(0);  // 現在ページのステート
  const itemsPerPage = 20;                            // 4×5のレイアウト
  const navigate = useNavigate();                     // useNavigateフックを使用
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("sm")); // モバイル判定
  
//fetchDataを改修したためコメントアウト(念のために残す)
  // // コンポーネントの初期レンダリング時にユーザー情報を取得
  // useEffect(() => {
  //   const fetchData = async () => {
  //     const result = await alluserInfo();
  //     setPeople(result); // 取得したデータをpeopleにセット
  //   };
  //   fetchData();
  // }, []);

  //コンポーネントの初期レンダリング時にalluserInfoとgetEmployeesByJoinMonthを切り替えて呼び出す
  useEffect(() => {
    const fetchData = async () => {
      let result;
      //fetchModeがallだった場合resultにalluserInfoを格納、joinMonthの場合getEmployeesByJoinMonthを格納
      if (fetchMode === 'all') {
        result = await alluserInfo();
      } else if (fetchMode === 'joinMonth') {
        if (userId !== undefined) {
          result = await getEmployeesByJoinMonth(userId)  //DB実装後引数をjoiningMonth(おそらくこの命名)に変更
        }
      }
      setPeople(result);
    };
    fetchData();
    //fetchModeまたはフィルタ条件が変わった場合に再フェッチ
  },[fetchMode, userId]); //DB実装後引数をjoiningMonth(おそらくこの命名)に変更
  


  //表示するメンバー
  const { id } = useParams();
  let displayMember = getDisplayMember("20", people);

  // フリーワード検索
  const filteredPeople = displayMember.filter(
    (data) =>
      data.user.userName.includes(searchTerm) ||
      data.department.some(department => department.departmentName.includes(searchTerm))
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
    <Box
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
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(4, 1fr)", // モバイル時は2列、PC時は4列
          gap: 2,
        }}
      >
        {displayedPeople.map((person) => (
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
              key={person.user.userId}
              onClick={() => handleCardClick(person.user.userId)}
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <CardMedia
                component="img"
                image={`data:image/jpeg;base64,${person.user.image}`}
                alt={person.user.userName}
                sx={{
                  width: 200, // 画像の幅を80pxに設定
                  height: 200, // 画像の高さを80pxに設定
                  margin: 1, // 画像の周りにマージンを追加
                }}
              />
              <CardContent>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: "bold", textAlign: "center" }}
                >
                  {person.user.userName}
                </Typography>
                {person.department.map((department, index) => {
                  let positionId = department.positionId;

                  return (
                    <Box
                      key={index}
                      sx={{ display: "flex", alignItems: "center" }}
                    >
                      {positionId !== "" && (
                        <Icon num={Number(positionId)} sx={{ ml: 1 }} />
                      )}
                      <Typography
                        variant="subtitle1"
                        sx={{ fontSize: "0.7rem", textAlign: "center" }}
                      >
                        {department.departmentName}
                      </Typography>
                    </Box>
                  );
                })}
              </CardContent>
            </CardActionArea>
          </Card>
        ))}
      </Box>

      {/* ページ移動ボタン */}
      <Box
        sx={{ display: "flex", justifyContent: "space-between", marginTop: 2 }}
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
      </Box>
    </Box>
  );
};

export default PeopleList;
