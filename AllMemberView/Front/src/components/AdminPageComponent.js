import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  CardActionArea,
  TextField,
  InputAdornment
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import axios from "axios";

// 名前を五十音順にソートする関数
const sortByKana = (a, b) => {
  return a.user.userName.localeCompare(b.user.userName, "ja", { numeric: true, ignorePunctuation: true });
};

const PeopleList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [people, setPeople] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 50; 
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:8080/allmemberview/api/alluserinfo", {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("APIレスポンス:", response.data);
        const sortedData = response.data.sort(sortByKana);
        setPeople(sortedData);
      } catch (err) {
        console.error("ユーザー情報取得エラー:", err);
      }
    };
    fetchData();
  }, []);

  const filteredPeople = people.filter(
    (data) =>
      data.user.userName.includes(searchTerm) ||
      data.department.some(department => department.departmentName.includes(searchTerm))
  );

  const displayedPeople = filteredPeople.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const handleNextPage = () => {
    if ((currentPage + 1) * itemsPerPage < filteredPeople.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  // クリックされたユーザーの詳細ページへ遷移
  const handleCardClick = (userId) => {
    navigate(`/user/${userId}`);
  };

  return (
    <Box sx={{ padding: 2, minHeight: "100vh" }}>
      {/* 🔹 フリーワード検索 */}
      <Box sx={{ display: "flex", alignItems: "center", marginBottom: 2 }}>
        <TextField
          label="検索"
          variant="outlined"
          sx={{ marginRight: 2, backgroundColor: "white", width: "300px" }}
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
        <Button variant="contained" color="primary" sx={{ padding: "10px 20px" }} onClick={() => navigate('/create')}>
          新規作成
        </Button>
      </Box>

      {/* 🔹 ユーザー一覧（5列レイアウト） */}
      <Box sx={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 2 }}>
        {displayedPeople.map((person) => (
          <Card key={person.user.userId} sx={{ backgroundColor: "transparent", boxShadow: "none" }}>
            <CardActionArea onClick={() => handleCardClick(person.user.userId)}>
              <CardContent sx={{ padding: "8px 0" }}>
                <Typography variant="subtitle1" sx={{ fontWeight: "bold", textAlign: "center" }}>
                  {person.user.userName}
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        ))}
      </Box>

      {/* 🔹 ページ移動ボタン */}
      <Box sx={{ display: "flex", justifyContent: "space-between", marginTop: 2 }}>
        <Button variant="contained" onClick={handlePreviousPage} disabled={currentPage === 0}>
          前へ
        </Button>
        <Button variant="contained" onClick={handleNextPage} disabled={(currentPage + 1) * itemsPerPage >= filteredPeople.length}>
          次へ
        </Button>
      </Box>
    </Box>
  );
};

export default PeopleList;
