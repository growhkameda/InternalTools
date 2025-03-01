import { Button, Box, Paper, IconButton } from "@mui/material";
import { useState, useEffect } from "react";
import PeopleList from "../components/MemberListComponent";

const Home = () => {
  const currentYear = new Date().getFullYear();     //現在の西暦
  const currentMonth = new Date().getMonth() + 1;   //現在の月
  const [employees, setEmployees] = useState([]);   // フィルター後の社員を格納
  const [userId, setUserId] = useState(1);          // userIdで1を表示するためのもの(joiningMonthが実装され次第変更)
  const [year] = useState(currentYear);    // 現在の西暦を初期値に格納
  const [month] = useState(currentMonth); // 現在の月を初期値に格納

  // トークンの取得
  const token = localStorage.getItem("token");      // ローカルストレージからJWTを取得 

  // fetchEmployees APIから今月の社員を取得
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await fetch(
          `/api/users-by-newEmployee?userId=${userId}`,   //DB更新後joinMonth(予定)に変更
          {
            method: "GET",
            headers: {
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json"
            }
          }
        );

        if (!response.ok) {
          throw new Error(`APIエラー: ${response.statusText}`);
        }

        const data = await response.json();
        setEmployees(data);   // 取得した社員データをセットする
      } catch (err) {
        console.error(err.message);
      }
    };

    fetchEmployees();
  }, [userId]); // 年月が変わるたびに再取得   DB更新後joinMonth(予定)に変更

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      {/* 左側（縦2分割の左） */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Paper
          elevation={3}
          sx={{
            width: "90%",
            height: "90%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          組織図を編集したよ
        </Paper>
      </Box>

      {/* 右側（縦2分割の右） */}
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Box
          sx={{
            flex: 1,
            display: "flex",
            // justifyContent: "center",
            // alignItems: "center",
            flexDirection: "column",
            minHeight: 0,                 //フレックスコンテナ内で高さのオーバーフローを防ぐ
          }}
        >
          <Box
            sx={{
              flex: 1,
              overflow: "auto",           //内容が溢れた場合にスクロールする
              p: 1,
            }}
            >
          <Paper
            elevation={3}
            sx={{
              width: "90%",
              height: "90%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            誕生月の社員
          </Paper>
        </Box>
        <Box
          sx={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Paper
            elevation={3}
            sx={{
              width: "90%",
              height: "90%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center"}}>
              <h3>{year}年 {month}月入社の社員！</h3>
              <PeopleList fetchMode="joinMonth"/>
            </Box>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default Home;
