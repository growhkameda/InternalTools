import React, { useState } from "react";
import { Box, Paper, Grid2, Typography, FormControl, Select, MenuItem } from "@mui/material";
import OrganizationChartComponent from "../components/OrganizationChartComponent";
import MemberView from "../components/MemberListComponent";
import {
  ACTIONVIEW_BIRTHDAY_USER,
  ACTIONVIEW_ORGCHART_TITLE,
  //ACTIONVIEW_BIRTHDAY_TITLE,
  ACTIONVIEW_JOINMONTH_TITLE,
  ACTIONVIEW_JOINMONTH_USER,
} from "../common/Const";

const Home = ({router}) => {
  const [ birthdayMonth, setBirthdayMounth ] = useState(new Date().getMonth() + 1);
  return (
    <Box sx={{ height: "100vh", padding: 2 }}>
      <Grid2 container spacing={2} sx={{ height: "100%" }}>
        {/* 左側: 組織図 (モバイル1列、PC 2分割) */}
        <Grid2
          size={{xs:12, lg:6}}
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            alignItems: "center",
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: "bold", textAlign: "center" }}>
            {ACTIONVIEW_ORGCHART_TITLE}
          </Typography>

          <Paper
            elevation={3}
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "flex-start",
            }}
          >
            {/* 組織図コンポーネント */}
            <OrganizationChartComponent router={router}/>
          </Paper>
        </Grid2>

        {/* 右側: 今月の誕生日社員 (モバイル1列、PC 2分割) */}
        <Grid2
          size={{xs:12, lg:6}}
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
          }}
        >
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: "bold", textAlign: "center" }}>
            ★★★{birthdayMonth}月の誕生日★★★
          </Typography>

          <FormControl size="small" sx={{ minWidth: 90 }}>
            <Select
              value={birthdayMonth}
              onChange={(e) => setBirthdayMounth(Number(e.target.value))}>
              {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                <MenuItem key={m} value={m}>
                  {m}月
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

          <Paper
            elevation={3}
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "flex-start",
            }}
          >
            <MemberView actionView={ACTIONVIEW_BIRTHDAY_USER} birthdayMonth={birthdayMonth} />
          </Paper>

          <Typography
            variant="h6"
            sx={{ fontWeight: "bold", textAlign: "center" }}
            marginTop={3}
          >
            {ACTIONVIEW_JOINMONTH_TITLE}
          </Typography>

          <Paper
            elevation={3}
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "flex-start",
            }}
          >
            <MemberView actionView={ACTIONVIEW_JOINMONTH_USER} />
          </Paper>
        </Grid2>
      </Grid2>
    </Box>
  );
};


export default Home;
