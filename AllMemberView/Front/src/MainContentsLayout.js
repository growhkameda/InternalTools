import * as React from "react";
import { createTheme } from "@mui/material/styles";
import { useMediaQuery } from "@mui/material";
import { AppProvider } from "@toolpad/core/AppProvider";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import { Button, Box, IconButton  } from "@mui/material";
import { useNavigate } from 'react-router-dom';
import LogoutIcon from '@mui/icons-material/Logout';

const demoTheme = createTheme({
  cssVariables: {
    colorSchemeSelector: "data-toolpad-color-scheme",
  },
  // colorSchemes: { light: true, dark: true },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
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

  return (
    <AppProvider
      theme={demoTheme}
      navigation={navigation}
      branding={{
        logo: (
          <img
            src="https://prtimes.jp/data/corp/106162/ogp/70bfd07cf65ac8125cd9ea34c728d206-f2334be5ffee7dba4ae23c3d975f5f4d.jpeg"
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
        slots={{ toolbarActions: LogoutButton }}
      >
        <Box sx={{ padding: isMobile ? 2 : 5 }}>{children}</Box> {/* レスポンシブなパディング */}
      </DashboardLayout>
    </AppProvider>
  );
};

export default MainContentsLayout;
