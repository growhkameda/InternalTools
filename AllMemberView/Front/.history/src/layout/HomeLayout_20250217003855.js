import { Button, Box, Paper, IconButton } from "@mui/material";
import { useState, useEffect } from "react";
s

const Home = () => {
  const [employees, setEmployees] = useState([]);   //登録されている社員データ
  const [year, setYear]           = useState(2025); //現在年のダミーとして2025年を指定
  const [month, setMonth]         = useState(8)     //現在月のダミーとして8月を指定

  //社員データを取得する(今回はDBから参照ではなくダミー登録で表示テスト)
  useEffect(() => {
    const allEmployees = [
    	{ name: "佐藤", joinYear: 2025, joinMonth: 8 },
    	{ name: "鈴木", joinYear: 2025, joinMonth: 8 },	
    	{ name: "山田", joinYear: 2025, joinMonth: 8 },	
    ];

  //指定した年月の社員を検索する
  const filter = allEmployees.filter(emp => emp.joinYear === year && emp.joinMonth ===month);
  setEmployees(filter);
  }, [year, month]);


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
			 employees.map((emp, index) => <p key={index}>{emp.name}</p>)
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
