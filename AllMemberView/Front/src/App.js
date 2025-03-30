import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import {jwtDecode} from "jwt-decode";
import LoginForm from "./layout/LoginLayout";
import ToolpadDashboardLayout from "./layout/DashboardLayout";
import UserDetailComponent from "./components/UserDetailComponent";

const App = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isFromAdminPage, setIsFromAdminPage] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = jwtDecode(token);
      const isAdminValue = decodedToken.isAdmin; // トークンのisAdminフィールドを使用
      setIsAdmin(isAdminValue);
    }
  }, []); // 空の依存配列でコンポーネントのマウント時のみ実行

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginForm setIsAdmin={setIsAdmin} setIsFromAdminPage={setIsFromAdminPage}/>} />
        <Route path="/dashboard" element={<ToolpadDashboardLayout isAdmin={isAdmin} setIsFromAdminPage={setIsFromAdminPage}/>}/>
        <Route path="/user/:id" element={<UserDetailComponent isAdmin={isAdmin} isFromAdminPage={isFromAdminPage}/>} />
        <Route path="/regnewuser/:id" element={<UserDetailComponent isAdmin={isAdmin} isNew={true} isFromAdminPage={isFromAdminPage}/>} />
      </Routes>
    </Router>
  );
};

export default App;
