import React, { useState } from "react";
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
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";
import CEOIcon from "./resource/CEO_icon.jpeg";
import ManagerIcon from "./resource/manager_icon.jpeg";
import ChiefIcon from "./resource/chief_icon.jpeg";
import ADIcon from "./resource/AD_icon.jpeg";

// サンプルデータ
const people = [
  {
    id: 1,
    name: "佐藤 太郎",
    position: "事務経理",
    image: "https://randomuser.me/api/portraits/men/1.jpg",
  },
  {
    id: 2,
    name: "鈴木 花子",
    position: "事務経理",
    image: "https://randomuser.me/api/portraits/women/2.jpg",
  },
  {
    id: 3,
    name: "田中 一郎",
    position: "事務経理",
    image: "https://randomuser.me/api/portraits/men/3.jpg",
  },
  {
    id: 4,
    name: "山田 次郎",
    position: "事務経理",
    image: "https://randomuser.me/api/portraits/women/4.jpg",
  },
  {
    id: 5,
    name: "井上 三郎",
    position: "事務経理",
    image: "https://randomuser.me/api/portraits/men/5.jpg",
  },
  {
    id: 6,
    name: "小林 四郎",
    position: "事務経理",
    image: "https://randomuser.me/api/portraits/men/6.jpg",
  },
  {
    id: 7,
    name: "森 さくら",
    position: "事務経理",
    image: "https://randomuser.me/api/portraits/women/7.jpg",
  },
  {
    id: 8,
    name: "高橋 桃子",
    position: "事務経理",
    image: "https://randomuser.me/api/portraits/women/8.jpg",
  },
  {
    id: 9,
    name: "佐藤 太郎",
    position: "事務経理",
    image: "https://randomuser.me/api/portraits/men/1.jpg",
  },
  {
    id: 10,
    name: "鈴木 花子",
    position: "事務経理",
    image: "https://randomuser.me/api/portraits/women/2.jpg",
  },
  {
    id: 11,
    name: "田中 一郎",
    position: "事務経理",
    image: "https://randomuser.me/api/portraits/men/3.jpg",
  },
  {
    id: 12,
    name: "山田 次郎",
    position: "事務経理",
    image: "https://randomuser.me/api/portraits/women/4.jpg",
  },
  {
    id: 13,
    name: "井上 三郎",
    position: "事務経理",
    image: "https://randomuser.me/api/portraits/men/5.jpg",
  },
  {
    id: 14,
    name: "小林 四郎",
    position: "事務経理",
    image: "https://randomuser.me/api/portraits/men/6.jpg",
  },
  {
    id: 15,
    name: "森 さくら",
    position: "事務経理",
    image: "https://randomuser.me/api/portraits/women/7.jpg",
  },
  {
    id: 16,
    name: "高橋 桃子",
    position: "事務経理",
    image: "https://randomuser.me/api/portraits/women/8.jpg",
  },
  {
    id: 17,
    name: "佐藤 太郎",
    position: "事務経理",
    image: "https://randomuser.me/api/portraits/men/1.jpg",
  },
  {
    id: 18,
    name: "鈴木 花子",
    position: "事務経理",
    image: "https://randomuser.me/api/portraits/women/2.jpg",
  },
  {
    id: 19,
    name: "田中 一郎",
    position: "事務経理",
    image: "https://randomuser.me/api/portraits/men/3.jpg",
  },
  {
    id: 20,
    name: "山田 次郎",
    position: "事務経理",
    image: "https://randomuser.me/api/portraits/women/4.jpg",
  },
  {
    id: 21,
    name: "井上 三郎",
    position: "事務経理",
    image: "https://randomuser.me/api/portraits/men/5.jpg",
  },
  {
    id: 22,
    name: "小林 四郎",
    position: "事務経理",
    image: "https://randomuser.me/api/portraits/men/6.jpg",
  },
  {
    id: 23,
    name: "森 さくら",
    position: "事務経理",
    image: "https://randomuser.me/api/portraits/women/7.jpg",
  },
  {
    id: 24,
    name: "高橋 桃子",
    position: "事務経理",
    image: "https://randomuser.me/api/portraits/women/8.jpg",
  },
];

const Icon = ({num}) => {
  let iconSrc
  let altSrc
  if (num === 1) {
    iconSrc = CEOIcon
    altSrc = "CEOIcon"
  }
  else if (num === 2) {
    iconSrc = ManagerIcon
    altSrc = "ManagerIcon"
  }
  else if (num === 3) {
    iconSrc = ChiefIcon
    altSrc = "ChiefIcon"
  }
  else if (num === 4) {
    iconSrc = ADIcon
    altSrc = "ADIcon"
  }
  return (
    <img
      src={iconSrc}
      alt={altSrc}
      style={{ width: 50, height: 50, borderRadius: "50%" }} // アイコンのサイズや形を調整
    />
  );
};

const PeopleList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 20; // 4×5のレイアウト
  const navigate = useNavigate(); // useNavigateフックを使用

  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("sm")); // モバイル判定

  // フリーワード検索
  const filteredPeople = people.filter(
    (person) =>
      person.name.includes(searchTerm) || person.position.includes(searchTerm)
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
    <Box sx={{ padding: 2 }}>
      {/* フリーワード検索用のテキストフィールド、虫眼鏡マーク付き */}
      <TextField
        label="検索"
        variant="outlined"
        fullWidth
        sx={{ marginBottom: 2 }}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        InputProps={{
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
                component="img"
                image={person.image}
                alt={person.name}
                sx={{
                  width: 80, // 画像の幅を80pxに設定
                  height: 80, // 画像の高さを80pxに設定
                  borderRadius: "50%", // 丸く切り取る
                  margin: 1, // 画像の周りにマージンを追加
                }}
              />
              {/* アイコンを画像の左上に配置 */}
              {(person.id === 1 || person.id === 2 || person.id === 3 || person.id === 4) && (
                <Box
                  sx={{
                    position: "absolute", // アイコンの位置を画像に対して絶対配置
                    top: 0,
                    left: 0,
                    fontSize: 30, // アイコンのサイズ
                    margin: "-10px", // 画像から少し距離をとる
                  }}
                >
                  <Icon num={person.id} />
                </Box>
              )}
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
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  {person.name}
                </Typography>
                <Typography variant="subtitle1">{person.position}</Typography>
              </Box>
            </CardContent>
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
