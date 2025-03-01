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

//現在の年月を"yyyy/mm"形式で取得する
const getCurrentJoiningMonth = () => {
  const now = new Date();           //フィルタリング用の変数
  const year = now.getFullYear();   //現在の年を取得
  const month = now.getMonth() + 1; //現在の月を取得
  
  //月が一桁の場合先頭に0を追加して渡す
  return `${year}/${month < 10 ? "0" + month : month}`;
};

// 指定入社月の社員をフィルタリングして表示する(getEmployeesByJoiningMonthとあるが試験的にuserIdでフィルタリングする)
const getEmployeesByJoiningMonth = async (joiningMonth) => {
  let responseData = [];  // サーバーからのレスポンスデータの格納用
  let getMemberUrl = "";  // 取得した社員情報のURLの格納用

  const envType = process.env.REACT_APP_ENV_TYPE; //  環境変数を格納
  //環境変数がstgなら
  if (envType === "stg") {
    getMemberUrl =
      "http://" + process.env.REACT_APP_MY_IP + "/api/users-by-newEmployee?joiningMonth=" + joiningMonth;
  } else {
    getMemberUrl =
      "http://localhost:8080/allmemberview/api/users-by-newEmployee?joiningMonth=" + joiningMonth;
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

//alluserinfoとgetEmployeesByJoiningMonthを切り替える(初期値はJoiningMonth)
const PeopleList = ({fetchMode = "JoiningMonth", joiningMonth: propJoiningMonth}) => {
  //fecthModeが"JoiningMonth"の場合、getCurrentJoiningMonthを設定, "all"の場合joiningMonthを使用せずnullに設定
  const [joiningMonth, setJoiningMonth] = useState(    
    fetchMode === "JoiningMonth" ? (propJoiningMonth !== undefined ? propJoiningMonth : getCurrentJoiningMonth) : null
  );    
  const [searchTerm, setSearchTerm] = useState("");
  const [people, setPeople] = useState([]);           // 人情報を管理するステート
  const [currentPage, setCurrentPage] = useState(0);  // 現在ページのステート
  const itemsPerPage = 20;                            // 4×5のレイアウト
  const navigate = useNavigate();                     // useNavigateフックを使用
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("sm")); // モバイル判定

  //コンポーネントの初期レンダリング時にalluserInfoとgetEmployeesByJoiningMonthを切り替えて呼び出す
  useEffect(() => {
    const fetchData = async () => {
      let result;
      //fetchMode
      if (fetchMode === 'all') {
        result = await alluserInfo();
      } else if (fetchMode === 'JoiningMonth') {
        if (joiningMonth !== undefined) {
          result = await getEmployeesByJoiningMonth(joiningMonth)
        }
      }
      console.log("Fetched result:", result); //DB接続テストlog
      setPeople(result);
    };
    fetchData();
    //fetchModeまたはフィルタ条件が変わった場合に再フェッチ
  },[fetchMode, joiningMonth]);
  


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
      {/* フリーワード検索用のテキストフィールド、虫眼鏡マーク付き(getEmployeesByJoiningMonthでは無し) */}
      {fetchMode !== "JoiningMonth" && (
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
      )}

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
              width: 150
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
                  width: 150,         // 画像の幅を150pxに設定                　　※この辺りは要調整
                  height: 150,        // 画像の高さを150pxに設定
                  margin: 1,          // 画像の周りにマージンを追加
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
