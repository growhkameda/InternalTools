import React from "react";
import { createTheme } from "@mui/material/styles";
import { AppProvider } from "@toolpad/core/AppProvider";
import { DashboardLayout as ToolpadDashboardLayout } from "@toolpad/core/DashboardLayout";
import { Button, IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";
import LogoutIcon from "@mui/icons-material/Logout";
import { rootData } from "../RootConfig";
import { useRouterContext } from "../context/RouterContext";
import Home from "./HomeLayout";
import MemberView from "../components/MemberListComponent";
import AdminPage from "../components/AdminPageComponent";
import PasswordChangeComponent from "../components/PasswordChangeComponent";
import {
  ACTIONVIEW_ALL_USER,
  ACTIONVIEW_DEPARTMENT_USER,
} from "../common/Const";

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

const DashboardLayout = ({ isAdmin, setIsFromAdminPage }) => {
  const [drawerOpen, setDrawerOpen] = React.useState(false); // ドロワーの開閉状態を管理
  setIsFromAdminPage(false)

  const handleDrawerToggle = () => {
    // ドロワーが閉じているときにボタンを押しても開かないようにする
    if (!drawerOpen) return;
    setDrawerOpen(!drawerOpen);
  };

  const router = useRouterContext();

  const contnts = () => {
    if (router.pathname === "/alluser") {
      return <MemberView actionView={ACTIONVIEW_ALL_USER} />;
    } else if (router.pathname === "/departmentuser") {
      const storedId = localStorage.getItem('selectedId');
      if(storedId) {
        const idList = storedId.split(',').map(id => id.trim());
        router.pathname = "/alluser"
        return <MemberView actionView={ACTIONVIEW_DEPARTMENT_USER} bodyValue={idList} />;
      }
    } else if (router.pathname === "/change-password") {
      return <PasswordChangeComponent />;
    } else if (router.pathname === "/admin-page") {
      setIsFromAdminPage(true)
      return <AdminPage/>;
    } else {
      router.pathname = "/home"
      return <Home router={router}/>;
    }
  };

  return (
    <AppProvider
      theme={demoTheme}
      navigation={rootData({isAdmin})}
      router={router}
      branding={{
        logo: <img src="/titlelogo.png" alt="grow logo" />,
        title: "ぐろなび",
      }}
    >
      <ToolpadDashboardLayout
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
