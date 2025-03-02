import PersonAddIcon from "@mui/icons-material/PersonAdd";
import HomeIcon from "@mui/icons-material/Home";
import KeyIcon from "@mui/icons-material/Key";
import GroupsIcon from "@mui/icons-material/Groups";

// NAVIGATION を動的に生成
export const rootData = ({ isAdmin }) => {
  const baseMenu = [
    {
      segment: "home",
      title: "HOME",
      icon: <HomeIcon />,
    },
    {
      segment: "change-password",
      title: "パスワード変更",
      icon: <KeyIcon />,
    },
    {
      segment: "alluser",
      title: "社員一覧",
      icon: <GroupsIcon />,
    },
  ];

  // 管理者用のメニューを条件付きで追加
  if (isAdmin) {
    baseMenu.push({
      segment: "admin-page",
      title: "管理者ページ",
      icon: <PersonAddIcon />,
    });
  }

  return baseMenu;
};
