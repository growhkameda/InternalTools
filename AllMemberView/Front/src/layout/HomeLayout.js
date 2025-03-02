import { Box, Paper, Grid2, Typography } from "@mui/material";
import OrganizationChartComponent from "../components/OrganizationChartComponent";
import MemberView from "../components/MemberListComponent";
import {
  ACTIONVIEW_BIRTHDAY_USER,
  ACTIONVIEW_ORGCHART_TITLE,
  ACTIONVIEW_BIRTHDAY_TITLE,
  ACTIONVIEW_JOINMONTH_TITLE,
  ACTIONVIEW_JOINMONTH_USER,
} from "../common/Const";

const Home = ({router}) => {
  return (
    <Box sx={{ height: "100vh", padding: 2 }}>
      <Grid2 container spacing={2} sx={{ height: "100%" }}>
        {/* 左側: 組織図 (モバイル1列、PC 2分割) */}
        <Grid2
          size={{xs:12, md:6}}
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            height: "100%", // 親と同じ高さに
            overflow: "auto", // 親の高さを超える内容のスクロール
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: "bold", textAlign: "center" }}>
            {ACTIONVIEW_ORGCHART_TITLE}
          </Typography>

          <Paper
            elevation={3}
            sx={{
              width: "100%",
              height: "100%",
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "flex-start",
              overflow: "auto",
              padding: 2,
            }}
          >
            {/* 組織図コンポーネント */}
            <OrganizationChartComponent router={router}/>
          </Paper>
        </Grid2>

        {/* 右側: 今月の誕生日社員 (モバイル1列、PC 2分割) */}
        <Grid2
          size={{xs:12, md:6}}
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            height: "100%", // 親と同じ高さに
            overflow: "auto", // 親の高さを超える内容のスクロール
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: "bold", textAlign: "center" }}>
            {ACTIONVIEW_BIRTHDAY_TITLE}
          </Typography>

          <Paper
            elevation={3}
            sx={{
              width: "100%",
              height: "50%",
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "flex-start",
              overflow: "auto",
              padding: 2,
            }}
          >
            <MemberView actionView={ACTIONVIEW_BIRTHDAY_USER} />
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
              height: "50%",
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "flex-start",
              overflow: "auto",
              padding: 2,
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
