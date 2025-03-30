import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import {
  Avatar,
  Box,
  Button,
  Paper,
  TextField,
  Typography,
  Stack,
} from "@mui/material";

const LoginForm = ({ setIsAdmin, setIsFromAdminPage}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate(); // useNavigateフックを使用
  setIsFromAdminPage(false)

  let loginUrl = "";
  const envType = process.env.REACT_APP_ENV_TYPE;
  if (envType === "stg") {
    loginUrl = process.env.REACT_APP_MY_IP + "login";
  } else {
    loginUrl = "http://localhost:8080/allmemberview/api/login";
  }

  const handleLogin = async (e) => {
    e.preventDefault(); // フォームのデフォルトの動作を防ぐ

    try {
      const response = await axios.post(loginUrl, {
        email: email,
        password: password,
      });

      const token = response.data.token; // サーバーからのトークンを取得
      localStorage.setItem("token", token); // トークンをローカルストレージに保存

      const decodedToken = jwtDecode(token);
      const isAdmin = decodedToken.isAdmin; // トークンのisAdminフィールドを使用
      setIsAdmin(isAdmin);

      // ログイン成功後にユーザーリストに遷移
      navigate("/dashboard"); // /userlist に遷移
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
        backgroundColor: "rgba(211, 211, 211, 0.8)", // 半透明の背景
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
          <Box
            component="img"
            src="/titlelogo.png"
            alt="grow logo"
            sx={{ width: 200, height: 100 }} // 画像のサイズを指定
          />
          <Typography
            variant="h6"
            sx={{
              color: "orange",
              fontWeight: "bold"
            }}
          >
            - ぐろなび -
          </Typography>
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
              {error && <Typography color="error">{error}</Typography>}
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
