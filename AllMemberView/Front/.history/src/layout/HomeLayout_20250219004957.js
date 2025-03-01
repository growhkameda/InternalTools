import { Button, Box, Paper, IconButton } from "@mui/material";
import { useState, useEffect } from "react";
import { alluserInfo } from "../components/MemberListComponent";


const Home = () => {
  // 現在の西暦と月を取得
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1; 

  const [employees, setEmployees] = useState([]);   //フィルター後の社員を格納
  const [year, setYear] = useState(currentYear);    //現在の西暦を初期値に格納
  const [month, setMonth] = useState(currentMonth); //現在の月を初期値に格納
  const [loading, setLoading] = useState(false);    //ローディング状態
  const [error, setError] = useState(null);         //エラーメッセージ

  // fetchEmployees APIから今月の社員を取得
  useEffect(() => {
    const fetchEmployees = async () => {
      setLoading(ture);
      setError(null);
      return;
    }

  try {
    const response = await fetch(
      `/api/users-by-newEmployee?year=${year}&month=${month}`,
      {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      }
    );
  }  
    fetchEmployees();
  }, [year, month]); // 年月が変わるたびに再取得


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
			<h3>{year}年 {month}月入社の社員！</h3>
			{employees.length > 0 ? (
			  employees.map((emp, index) => <p key={index}>{emp.name}</p>)  //指定領域に今月の新入社員を表示
			) : (
				<p>該当者なし</p>
			)}
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default Home;
