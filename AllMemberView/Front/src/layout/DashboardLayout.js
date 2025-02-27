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
import Home from "./HomeLayout"
import OrganizationChartComponent from "../components/OrganizationChartComponent"

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

  // const contnts = () => {
  //   if (router.pathname === "/home") {
  //     return (<Home />)
  //   }
  //   else {
  //     return (router.pathname)
  //   }
  // }

  const contnts = () => {
    switch(router.pathname){
      case "/home":
        return (<Home />);
      case "/organization-chart":
        return (<OrganizationChartComponent />);
      default:
        return (router.pathname);
    }
  }



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
        {contnts()}
      </ToolpadDashboardLayout>
    </AppProvider>
  );
};

export default DashboardLayout;
