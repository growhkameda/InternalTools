import PersonAddIcon from "@mui/icons-material/PersonAdd";
import BarChartIcon from "@mui/icons-material/BarChart";
import HomeIcon from '@mui/icons-material/Home';
import AddBusinessIcon from "@mui/icons-material/AddBusiness";
import KeyIcon from "@mui/icons-material/Key";


  // NAVIGATION を動的に生成
  export const rootData = [
    // {
    //   kind: "header",
    //   title: "メニュー",
    // },
    {
      segment: "home",
      title: "HOME",
      icon: <HomeIcon />,
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
        segment: "new-user",
        title: "ユーザ登録",
        icon: <PersonAddIcon />,
      },
      {
        segment: "new-project",
        title: "案件登録",
        icon: <AddBusinessIcon />,
      }
      
  ];
