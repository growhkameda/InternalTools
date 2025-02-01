import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import {jwtDecode} from "jwt-decode";
import LoginForm from "./layout/LoginLayout";
import OrganizationChartComponent from "./components/OrganizationChartComponent";
import ToolpadDashboardLayout from "./layout/DashboardLayout";
import UserDetailComponent from "./components/UserDetailComponent";
import MemberListComponent from "./components/MemberListComponent";
import PasswordChangeComponent from "./components/PasswordChangeComponent";
import ProjectDetailComponent from "./components/ProjectDetailComponent";

const App = () => {
  // トークンからisAdminを取得 (例: ローカルストレージからトークンを取得してデコード)
  const token = localStorage.getItem("token");
  let isAdmin = false;

  if (token) {
    const decodedToken = jwtDecode(token);
    isAdmin = decodedToken.isAdmin; // トークンのisAdminフィールドを使用
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route
          path="/dashboard"
          element={
            <ToolpadDashboardLayout isAdmin={isAdmin} token={token} />}
        />
        <Route path="/organization" element={<OrganizationChartComponent />} />
        <Route path="/user/:id" element={<UserDetailComponent />} />
        <Route path="/members" element={<MemberListComponent />} />
        <Route path="/password-change" element={<PasswordChangeComponent />} />
        <Route path="/project/:id" element={<ProjectDetailComponent />} />
      </Routes>
    </Router>
  );
};

export default App;
