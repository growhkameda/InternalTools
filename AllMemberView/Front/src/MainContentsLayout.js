import * as React from "react";
import { createTheme } from "@mui/material/styles";
import { AppProvider } from "@toolpad/core/AppProvider";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";


const demoTheme = createTheme({
  cssVariables: {
    colorSchemeSelector: "data-toolpad-color-scheme",
  },
  colorSchemes: { light: true, dark: true },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 600,
      lg: 1200,
      xl: 1536,
    },
  },
});

const MainContentsLayout = ({ children, navigation }) => {
    return (
      <AppProvider theme={demoTheme} navigation={navigation}
      branding={{
        logo: <img src="https://prtimes.jp/data/corp/106162/ogp/70bfd07cf65ac8125cd9ea34c728d206-f2334be5ffee7dba4ae23c3d975f5f4d.jpeg" alt="grow logo" />,
        title: 'ぐろなび',
      }}>
        <DashboardLayout
        sx={{
          // ネイビーの3色のグラデーションを設定
          backgroundImage: "linear-gradient(to bottom right, #001F3F, #003366, #00509E)", // ダークネイビー、ミディアムネイビー、ライトネイビー
          backgroundSize: "cover",
          height: "100vh", // 高さを画面全体に
        }}
      >
          {children}
        </DashboardLayout>
      </AppProvider>
    );
  };
  
  export default MainContentsLayout;