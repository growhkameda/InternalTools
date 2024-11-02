import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginForm from "./LoginForm";
import UserList from "./UserList";
import OrganizationChartComponent from "./OrganizationChartComponent";
import MainContentsLayout from "./MainContentsLayout";
import MemberListComponent from "./MemberListComponent";
import GroupsIcon from "@mui/icons-material/Groups";
import BarChartIcon from "@mui/icons-material/BarChart";
import DescriptionIcon from "@mui/icons-material/Description";
import LayersIcon from "@mui/icons-material/Layers";

const NAVIGATION = [
  {
    kind: "header",
    title: "Main items",
  },
  {
    segment: "userlist",
    title: "Member",
    icon: <GroupsIcon />,
  },
  {
    segment: "organization-chart",
    title: "Organization Chart",
    icon: <BarChartIcon />,
  },
  {
    kind: "divider",
  },
  {
    kind: "header",
    title: "Analytics",
  },
  {
    segment: "reports",
    title: "Reports",
    icon: <BarChartIcon />,
    children: [
      {
        segment: "sales",
        title: "Sales",
        icon: <DescriptionIcon />,
      },
      {
        segment: "traffic",
        title: "Traffic",
        icon: <DescriptionIcon />,
      },
    ],
  },
  {
    segment: "integrations",
    title: "Integrations",
    icon: <LayersIcon />,
  },
];

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route
          path="/userlist"
          element={
            <MainContentsLayout navigation={NAVIGATION}>
              <UserList />
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
          path="/accounting"
          element={
            <MainContentsLayout navigation={NAVIGATION}>
              <MemberListComponent />
            </MainContentsLayout>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
