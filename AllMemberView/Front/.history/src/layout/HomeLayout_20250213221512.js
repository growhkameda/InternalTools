import { useState, useEffect } from "react";
import { Button, Box, Paper } from "@mui/material";
import alluserInfo from "./alluserInfo"; // ユーザー情報取得関数をインポート

const Home = () => {
  const [employees, setEmployees] = useState([]);
  const targetMonth = 4; // 例えば4月入社の社員を表示する

  useEffect(() => {
    const fetchData = async () => {
      const data = await alluserInfo();
      // 入社月が targetMonth と一致する社員をフィルタ
      const filteredEmployees = data.filter(emp => emp.entryMonth === targetMonth);
      setEmployees(filteredEmployees);
    };

    fetchData();
  }, []);

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
              padding: 2,
              overflow: "auto",
            }}
          >
            <h3>{targetMonth}月入社の社員</h3>
            <ul>
              {employees.length > 0 ? (
                employees.map((emp) => (
                  <li key={emp.id}>{emp.name}（{emp.entryMonth}月入社）</li>
                ))
              ) : (
                <p>該当する社員はいません</p>
              )}
            </ul>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default Home;

