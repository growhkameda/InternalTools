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

  // alluserInfoから社員データを取得し、指定年月のデータをフィルタリング
  useEffect(() => {
    const fetchEmployees = async () => {
      const data = await alluserInfo(); // APIからデータ取得
      if (data.length > 0) {
        // 指定した年月の社員を検索(一時的に誕生月フィルターに変更)
        //const filtered = data.filter(emp => emp.joinYear === year && emp.joinMonth === month);　
        const filtered = data.filter(emp => emp.******* === month); //一時的に誕生月フィルターに変更するためにどうやって参照する？
        setEmployees(filtered);
      }
    };
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
			 //employees.map((emp, index) => <p key={index}>{emp.name}</p>) ダミーデータ表示からDB参照のデータ表示に切り替え予定
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
