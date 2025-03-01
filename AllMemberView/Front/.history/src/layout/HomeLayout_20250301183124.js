import { Button, Box, Paper, IconButton } from "@mui/material";
import { useState, useEffect } from "react";
import PeopleList from "../components/MemberListComponent";

const Home = () => {
  const currentYear = new Date().getFullYear();     //現在の西暦
  const currentMonth = new Date().getMonth() + 1;   //現在の月
  const year = useState(currentYear);    // 現在の西暦を初期値に格納
  const [month] = useState(currentMonth); // 現在の月を初期値に格納

  // トークンの取得
  const token = localStorage.getItem("token");      // ローカルストレージからJWTを取得 

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
            flexDirection: "column",
          }}
        >
          <Paper
            elevation={3}
            sx={{
              width: "100%",
              height: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {/* <Typography variant="h5">誕生月の社員</Typography> */}
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
              <PeopleList fetchMode="JoiningMonth"/>
            </Box>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default Home;
