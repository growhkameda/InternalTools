import { Button, Box, Paper } from "@mui/material";
import { useState, useEffect } from "react";
import alluserInfo from "../components/MemberListComponent";

const Home = () => {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);

  const targetMonth = new Date().getMonth() + 1; // 現在の月

 useEffect(() => {
  const fetchEmployees = async () => {
    try {
      const data = await alluserInfo();
      console.log("取得した社員データ:", data);
      setEmployees(data);
    } catch (error) {
      console.error("社員情報の取得に失敗しました", error);
    }
  };
  fetchEmployees();
  }, []);

  useEffect(() => {
    // targetMonth と一致する社員をフィルタリング
    const filtered = employees.filter(
      (emp) => emp.joinMonth === targetMonth // "joinMonth" は入社月のフィールド名に合わせる
    );
    setFilteredEmployees(filtered);
  }, [employees, targetMonth]);

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      {/* 左側 */}
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

      {/* 右側 */}
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
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              padding: 2,
            }}
          >
            <strong>{targetMonth}月入社の社員！</strong>
            {filteredEmployees.length > 0 ? (
              <ul>
                {filteredEmployees.map((emp) => (
                  <li key={emp.id}>{emp.name}</li> // "id" と "name" はデータ構造に合わせて変更
                ))}
              </ul>
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
