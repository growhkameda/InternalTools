import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginForm from "./LoginForm";
import OrganizationChartComponent from "./OrganizationChartComponent";
import MainContentsLayout from "./MainContentsLayout";
import UserDetailComponent from "./UserDetailComponent";
import MemberListComponent from "./MemberListComponent";
import PasswordChangeComponent from "./PasswordChangeComponent";
import ProjectDetailComponent from "./ProjectDetailComponent";
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import BarChartIcon from "@mui/icons-material/BarChart";
import AddBusinessIcon from '@mui/icons-material/AddBusiness';
import KeyIcon from '@mui/icons-material/Key';

const NAVIGATION = [
  {
    kind: "header",
    title: "メニュー",
  },
  {
    segment: "organization-chart",
    title: "組織図",
    icon: <BarChartIcon />,
  },
  {
    segment: "change-password",
    title: "パスワード変更",
    icon: <KeyIcon />,
  },
  {
    kind: "divider",
  },
  {
    kind: "header",
    title: "管理者メニュー",
  },
  {
    segment: "new-user",
    title: "ユーザ登録",
    icon: <PersonAddIcon />,
  },
  {
    segment: "new-project",
    title: "案件登録",
    icon: <AddBusinessIcon />,
  },
];

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route
          path="/change-password"
          element={
            <MainContentsLayout navigation={NAVIGATION}>
              <PasswordChangeComponent />
            </MainContentsLayout>
          }
        />
        <Route
          path="/organization-chart"
          element={
            <MainContentsLayout navigation={NAVIGATION}>
              <OrganizationChartComponent />
            </MainContentsLayout>
          }
        />
        <Route
          path="/userlist/:id"
          element={
            <MainContentsLayout navigation={NAVIGATION}>
              <MemberListComponent />
            </MainContentsLayout>
          }
        />
        <Route
          path="/user/:id"
          element={
            <MainContentsLayout navigation={NAVIGATION}>
              <UserDetailComponent />
            </MainContentsLayout>
          }
        />
        <Route
          path="/new-user"
          element={
            <MainContentsLayout navigation={NAVIGATION}>
              <UserDetailComponent isNewUser={true}/>
            </MainContentsLayout>
          }
        />
        <Route
          path="/new-project"
          element={
            <MainContentsLayout navigation={NAVIGATION}>
              <ProjectDetailComponent />
            </MainContentsLayout>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
