import React, { useState } from 'react';
import { Box, Button, Card, CardContent, CardHeader, Divider, FormControl, InputLabel, OutlinedInput, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { httpRequestUtil } from "../common/Utils";
import { REQUEST_METHOD_POST } from "../common/Const";

const PasswordChangeForm = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const navigate = useNavigate();

  let changePasswordUrl = ""
  const envType = process.env.REACT_APP_ENV_TYPE;
  if(envType === "stg") {
    changePasswordUrl = process.env.REACT_APP_MY_IP + "change-password"
  }
  else {
    changePasswordUrl = "http://localhost:8080/allmemberview/api/change-password"
  }

  const handleSubmit = async (e) => {
    e.preventDefault(); // フォームのデフォルトの動作を防ぐ

    if (newPassword !== confirmPassword) {
      setErrorMessage('新しいパスワードと確認用パスワードが一致しません');
      setSuccessMessage('');
    } else {

      let body = {
        currentPassword: currentPassword,
        newPassword: newPassword,
      }

      await httpRequestUtil(changePasswordUrl, body, REQUEST_METHOD_POST);

      // パスワード変更処理をここに実装（成功時）
      setSuccessMessage('パスワードが変更されました');
      setErrorMessage('');

      setTimeout(() => {
        navigate('/');
      }, 2000);
    };
  }  
  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
      <Card sx={{ maxWidth: 500, width: '100%' }}>
        <CardHeader title="パスワード変更" />
        <Divider />
        <CardContent>
          <form onSubmit={handleSubmit}>
            <Box display="flex" flexDirection="column" gap={2}>
              {/* 既存のパスワード */}
              <FormControl fullWidth required>
                <InputLabel>現在のパスワード</InputLabel>
                <OutlinedInput
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  label="現在のパスワード"
                />
              </FormControl>

              {/* 新しいパスワード */}
              <FormControl fullWidth required>
                <InputLabel>新しいパスワード</InputLabel>
                <OutlinedInput
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  label="新しいパスワード"
                />
              </FormControl>

              {/* 確認用パスワード */}
              <FormControl fullWidth required>
                <InputLabel>確認用パスワード</InputLabel>
                <OutlinedInput
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  label="確認用パスワード"
                />
              </FormControl>

              {/* エラーメッセージ */}
              {errorMessage && (
                <Typography color="error">{errorMessage}</Typography>
              )}

              {/* 成功メッセージ */}
              {successMessage && (
                <Typography color="primary">{successMessage}</Typography>
              )}

              {/* 送信ボタン */}
              <Button type="submit" variant="contained" color="primary" fullWidth>
                パスワードを変更する
              </Button>
            </Box>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default PasswordChangeForm;
