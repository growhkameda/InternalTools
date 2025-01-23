import * as React from "react";
import { createTheme } from "@mui/material/styles";
import { useMediaQuery } from "@mui/material";
import { AppProvider } from "@toolpad/core/AppProvider";
import { DashboardLayout as ToolpadDashboardLayout } from "@toolpad/core/DashboardLayout";
import { Button, Box, Paper, IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";
import LogoutIcon from "@mui/icons-material/Logout";
import { rootData } from "../RootConfig";
import { useDemoRouter } from "@toolpad/core/internal";

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
    <Button
      variant="contained"
      startIcon={<LogoutIcon />}
      onClick={handleLogout}
    >
      ログアウト
    </Button>
  );
};

const DashboardLayout = ({ children }) => {
  const isMobile = useMediaQuery(demoTheme.breakpoints.down("sm")); // 画面幅600px以下でモバイル表示
  const [drawerOpen, setDrawerOpen] = React.useState(false); // ドロワーの開閉状態を管理

  const handleDrawerToggle = () => {
    // ドロワーが閉じているときにボタンを押しても開かないようにする
    if (!drawerOpen) return;
    setDrawerOpen(!drawerOpen);
  };

  const router = useDemoRouter();

  return (
    <AppProvider
      theme={demoTheme}
      navigation={rootData}
      router={router}
      branding={{
        logo: <img src="/titlelogo.png" alt="grow logo" />,
        title: "ぐろなび",
      }}
    >
      <ToolpadDashboardLayout
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
              組織図
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
                新入社員の社員
              </Paper>
            </Box>
          </Box>
        </Box>
      </ToolpadDashboardLayout>
    </AppProvider>
  );
};

export default DashboardLayout;
