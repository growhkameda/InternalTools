import * as React from "react";
import { createTheme } from "@mui/material/styles";
import { useMediaQuery } from "@mui/material";
import { AppProvider } from "@toolpad/core/AppProvider";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import { Button, Box, IconButton  } from "@mui/material";
import { useNavigate } from 'react-router-dom';
import LogoutIcon from '@mui/icons-material/Logout';

const demoTheme = createTheme({
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "ffffff", // ヘッダーの色
          color: "#ffffff", // ヘッダー内のテキスト色
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: "#333333", // サイドバーの背景色
          color: "#ffffff", // サイドバーのテキスト色
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          // kind: "header"の行の色を追加
          "&.header-item": {
            backgroundColor: "#003366", // ヘッダーの背景色
            color: "#ffffff", // ヘッダー内のテキスト色
            "&:hover": {
              backgroundColor: "#1976d2", // ホバー時の背景色
            },
          },
        },
      },
    },
  },
});



const LogoutButton = ({ isMobile }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return isMobile ? (
    <IconButton color="primary" onClick={handleLogout}>
      <LogoutIcon />
    </IconButton>
  ) : (
    <Button variant="contained" startIcon={<LogoutIcon />} onClick={handleLogout}>
      ログアウト
    </Button>
  );
};

const MainContentsLayout = ({ children, navigation }) => {
  const isMobile = useMediaQuery(demoTheme.breakpoints.down("sm")); // 画面幅600px以下でモバイル表示
  const [drawerOpen, setDrawerOpen] = React.useState(false); // ドロワーの開閉状態を管理

  const handleDrawerToggle = () => {
    // ドロワーが閉じているときにボタンを押しても開かないようにする
    if (!drawerOpen) return;
    setDrawerOpen(!drawerOpen);
  };

  return (
    <AppProvider
      theme={demoTheme}
      navigation={navigation}
      branding={{
        logo: (
          <img
            src="/titlelogo.png"
            alt="grow logo"
          />
        ),
        title: "ぐろなび",
      }}
    >
      <DashboardLayout
        // sx={{
        //   backgroundImage: isMobile
        //     ? "none" // モバイルでは背景画像をオフ
        //     : "linear-gradient(to bottom right, #001F3F, #003366, #00509E)", // PCではグラデーション
        //   height: "100vh",
        // }}
        isDrawerOpen={drawerOpen} // 手動で開閉状態を管理
        onDrawerToggle={handleDrawerToggle} // トグルボタンのクリック時に呼ばれる
        slots={{ toolbarActions: LogoutButton }}
        sx={{
          backgroundColor: "#f5f5f5", // モバイルとPCで背景色を変える
          height: "100vh", // 高さを100vhに設定
        }}
      >
        <Box sx={{ padding: isMobile ? 2 : 5 }}>{children}</Box> {/* レスポンシブなパディング */}
      </DashboardLayout>
    </AppProvider>
  );
};

export default MainContentsLayout;
