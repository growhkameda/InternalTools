import React, { useState } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Button,
  Card,
  CardMedia,
  CardContent,
  Typography,
  TextField,
  InputAdornment,
  useMediaQuery,
  styled
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";



const position = [
  {
    id: "1",
    name: "ceo",
  },
  {
    id: "2",
    name: "執行役員",
  },
  {
    id: "3",
    name: "部長",
  },
  {
    id: "4",
    name: "課長",
  },
  {
    id: "5",
    name: "リーダ",
  },
];

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
    id: 15,
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
    department_name: ["TechGrowUp課", "開発課"],
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
    department_name: ["技術向上課", "開発課"],
    position: "技術向上課_4",
    birthday: "4/20",
    hobby: "ゲーム、バスケ、野球",
    image: "/profile/14.png",
  },
];

const Icon = ({ num }) => {
  let iconSrc;
  let altSrc;
  if (num === 1) {
    iconSrc = "/icons/ceo.png";
    altSrc = "CEOIcon";
  } else if (num === 3) {
    iconSrc = "/icons/manager.png";
    altSrc = "ManagerIcon";
  } else if (num === 4) {
    iconSrc = "/icons/department.png";
    altSrc = "ChiefIcon";
  } else if (num === 5) {
    iconSrc = "/icons/leader.png";
    altSrc = "ADIcon";
  }
  return (
    <img
      src={iconSrc}
      alt={altSrc}
      style={{ width: 40, height: 40, borderRadius: "50%" }} // アイコンのサイズや形を調整
    />
  );
};

const departmentIdGroup = {
  "2": ["2", "3", "4"],
  "6": ["6", "7", "8"],
  "9": ["9", "10", "11", "12", "13"],
  "11": ["11", "12", "13"],
  "14": ["14", "15", "16", "17", "18", "19"],
  "16": ["16", "17", "18", "19"],
  "20": ["20", "21", "22"],
};

const getDisplayMember = (id) => {
  let memberList = [];
  if (id === "0") {
    return people;
  }

  if (id in departmentIdGroup) {
    let groupId = departmentIdGroup[id];
    groupId.forEach((element) => {
      people.forEach((member) => {
        member.department_id.forEach((depId) => {
          if (element === String(depId)) {
            memberList.push(member);
          }
        });
      });
    });
  } else {
    people.forEach((member) => {
      member.department_id.forEach((depId) => {
        if (id === String(depId)) {
          memberList.push(member);
          return;
        }
      });
      if (memberList) {
        return;
      }
    });
  }

  memberList.sort((a, b) => {
    if (a.position === "" && b.position === "") return 0;
    if (a.position === "") return 1; // aのpositionが空ならbが前に来る
    if (b.position === "") return -1; // bのpositionが空ならaが前に来る



    return a.position.split("_")[1].localeCompare(b.position.split("_")[1]); // positionが空でない場合はアルファベット順で並べる
  });

  return memberList;
};

const StyledCard = styled(Card)(({ theme }) => ({
  padding: '0.5em 1em', // .box16 のパディング
  background: 'repeating-linear-gradient(-45deg, #f0f8ff, #f0f8ff 3px, #e9f4ff 3px, #e9f4ff 7px)', // .box16 の背景
  '& p': {
    margin: 0,
    padding: 0,         // .box16 p のスタイル
  },
}));

const PeopleList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 20; // 4×5のレイアウト
  const navigate = useNavigate(); // useNavigateフックを使用

  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("sm")); // モバイル判定

  //表示するメンバー
  const { id } = useParams();
  let displayMember = getDisplayMember(id);

  // フリーワード検索
  const filteredPeople = displayMember.filter(
    (person) =>
      person.name.includes(searchTerm) ||
      person.department_name.includes(searchTerm)
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
  const handleCardClick = (id) => {
    navigate(`/user/${id}`); // クリックされた社員の詳細ページに遷移
  };

  return (
    <Box sx={{ 
      padding: 2,
      backgroundImage: 'url(https://grow-community.net/wp-content/uploads/2022/09/S__15138831-1024x768.jpg.webp)',
      backgroundSize: 'cover', // 画像を全体にカバーする
      backgroundPosition: 'center', // 中央に配置
      minHeight: '100vh', // ビューポート全体の高さに設定
    }}>
      {/* フリーワード検索用のテキストフィールド、虫眼鏡マーク付き */}
      <TextField
        label="検索"
        variant="outlined"
        fullWidth
        sx={{ 
          marginBottom: 2, 
          backgroundColor: 'white'  // 背景色を白に設定
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
          <StyledCard
            key={person.id}
            onClick={() => handleCardClick(person.id)}
            sx={{
              cursor: "pointer",
              display: "flex",
              borderRadius: 2, // カードの角を丸く
              overflow: "hidden", // 画像のオーバーフローを隠す
              boxShadow: 3, // 少し影をつける
              flexDirection: isMobile ? "column" : "row", // モバイル時は縦並び、PC時は横並び
            }}
          >
            {/* 画像を含むラップするBox */}
            <Box
              sx={{
                position: "relative", // 親Boxにposition: relativeを追加して、アイコンの位置を相対的に指定できるように
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginBottom: isMobile ? 1 : 0, // モバイル時のみ下にマージンを追加
              }}
            >
              <CardMedia


image={person.image}
                alt={person.name}
                sx={{
                  width: 80, // 画像の幅を80pxに設定
                  height: 80, // 画像の高さを80pxに設定
                  borderRadius: "50%", // 丸く切り取る
                  margin: 1, // 画像の周りにマージンを追加
                }}
              />

            </Box>
            {/* 名前と職位を表示するCardContent */}
            <CardContent
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                padding: 2,
                textAlign: isMobile ? "center" : "left", // モバイル時は中央揃え
              }}
            >
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: "bold", fontSize: "1rem" }}
                >
                  {person.name}
                </Typography>
                {person.department_name.map((department, index) => {
                  let positionId = "";
                  if (person.position !== "") {
                    if (person.position.split("_")[0] === department) {
                      positionId = person.position.split("_")[1];
                    }
                  }

                  return (
                    <Box key={index} sx={{ display: "flex", alignItems: "center" }}>
                      <Typography
                        variant="subtitle1"
                        sx={{ fontSize: "0.7rem" }}
                      >
                        {department}
                      </Typography>
                      {positionId !== "" && (
                        <Icon num={Number(positionId)} sx={{ ml: 1 }} /> 
                      )}
                    </Box>
                  );
                })}
              </Box>            
            </CardContent>
          </StyledCard>
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
