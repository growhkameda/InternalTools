import * as React from "react";
import { createTheme } from "@mui/material/styles";
import { AppProvider } from "@toolpad/core/AppProvider";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import { useLocation } from "react-router-dom";
import { useDemoRouter } from '@toolpad/core/internal';

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
      <AppProvider theme={demoTheme} navigation={navigation}>
        <DashboardLayout>
          {children}
        </DashboardLayout>
      </AppProvider>
    );
  };
  
  export default MainContentsLayout;