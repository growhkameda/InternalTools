import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Avatar,
  Box,
  Button,
  Paper,
  TextField,
  Typography,
  Stack,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { teal } from "@mui/material/colors";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate(); // useNavigateフックを使用

  let loginUrl = ""
  const envType = process.env.REACT_APP_ENV_TYPE;
  if(envType === "stg") {
    loginUrl = "http://" + process.env.REACT_APP_MY_IP + "/api/login"
  }
  else {
    loginUrl = "http://localhost:8080/api/login"
  }

  const handleLogin = async (e) => {
    e.preventDefault(); // フォームのデフォルトの動作を防ぐ

    try {
      const response = await axios.post(loginUrl,
        {
          email: email,
          password: password,
        }
      );

      const token = response.data.token; // サーバーからのトークンを取得
      localStorage.setItem("token", token); // トークンをローカルストレージに保存

      // ログイン成功後にユーザーリストに遷移
      navigate("/organization-chart"); // /userlist に遷移
    } catch (err) {
      setError("Invalid username or password");
      console.error("Login error", err);
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh" // 画面全体の高さに合わせるために設定
      sx={{
        backgroundImage: 'url("https://start-it.co.jp/wp-content/uploads/2022/08/7bc30f40e205acea951afa95201eeaed-1024x499.png")', // ここに背景画像のパスを指定
        backgroundSize: "cover", // 画像をコンテナ全体に拡大縮小
        backgroundPosition: "center", // 中央に配置
        backgroundRepeat: "no-repeat", // 繰り返しなし
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          width: "300px",
          backdropFilter: "blur(5px)", // 背景をぼかす効果
          backgroundColor: "rgba(255, 255, 255, 0.8)", // 半透明の背景
        }}
      >
        <Stack
          direction="column"
          justifyContent="center"
          alignItems="center"
          spacing={2}
        >
          <Avatar sx={{ bgcolor: teal[400] }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography variant="h6">Login</Typography>

          <form onSubmit={handleLogin}>
            <Stack spacing={2}>
              <TextField
                label="Email"
                type="email"
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <TextField
                label="Password"
                type="password"
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              {error && (
                <Typography color="error">{error}</Typography>
              )}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
              >
                Login
              </Button>
            </Stack>
          </form>
        </Stack>
      </Paper>
    </Box>
  );
};

export default LoginForm;
