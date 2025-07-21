import React, { useEffect, useState } from "react";
import {
  List,
  ListItemButton,
  ListItemIcon,
  Collapse,
  IconButton,
  Box,
  Button,
} from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { styled } from '@mui/system';
import { httpRequestUtil } from '../common/Utils';

const hierarchy_0_List = [0]
const hierarchy_1_List = [1,7,13,17,20]
const hierarchy_2_List = [3,4,8,9,14,15,16,18,19,21,22,24]
const hierarchy_3_List = [5,6,10,11,12,23]

const sectionKeyMap = {
  "0":{section:"all", childFlg:true, viewidList:[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24]},
  "1":{section:"ceo", childFlg:false, viewidList:[1]},
  "7":{section:"itDept", childFlg:true,  viewidList:[7,4,5,6,8,9,10,11,12,23]},
  "4":{section:"sesZinzai", childFlg:true,  viewidList:[4,5,6]},
  "5":{section:"sesZinzaiServise", childFlg:false,  viewidList:[5]},
  "6":{section:"sesSouko", childFlg:false,  viewidList:[6]},
  "8":{section:"itEigyo", childFlg:false,  viewidList:[8]},
  "9":{section:"itSol", childFlg:true,  viewidList:[9,10,11,12,23]},
  "10":{section:"dev", childFlg:false,  viewidList:[10]},
  "11":{section:"test", childFlg:false,  viewidList:[11]},
  "12":{section:"itHelp", childFlg:false,  viewidList:[12]},
  "23":{section:"infra", childFlg:false,  viewidList:[23]},
  "13":{section:"backOffice", childFlg:true,  viewidList:[13,14,15,16]},
  "14":{section:"soumu", childFlg:false,  viewidList:[14]},
  "15":{section:"keiri", childFlg:false,  viewidList:[15]},
  "16":{section:"zimu", childFlg:false,  viewidList:[16]},
  "17":{section:"hr", childFlg:true,  viewidList:[17,18,19]},
  "18":{section:"zinji", childFlg:false,  viewidList:[18]},
  "19":{section:"kouhou", childFlg:false,  viewidList:[19]},
  "20":{section:"reSkikking", childFlg:true,  viewidList:[20,21,22,24]},
  "21":{section:"teck", childFlg:false,  viewidList:[21]},
  "22":{section:"teckup", childFlg:false,  viewidList:[22]},
  "24":{section:"caria", childFlg:false,  viewidList:[24]}
}

const organizationInfo = async (navigate) => {
  let responseData = [];

  let getorganizationUrl = "";
  const envType = process.env.REACT_APP_ENV_TYPE;
  if (envType === "stg") {
    getorganizationUrl = process.env.REACT_APP_MY_IP + "organization";
  } else {
    getorganizationUrl = "http://localhost:8080/allmemberview/api/organization";
  }
  try {
    responseData = await httpRequestUtil(getorganizationUrl, null , "GET")
  } catch (err) {
    //メンバーリストでアラートを出すので画面遷移のみ
    localStorage.removeItem("token");
    navigate("/");
  }


  return orgchartHierarchy(responseData)
};

const CustomButton= styled(Button)(({ id }) => {
  
  return {
    boxShadow: '0 5px 10px rgba(0, 0, 0, .1)',
    minWidth: '190px',
    '&:hover': {
      boxShadow: '0 2px 3px rgba(0, 0, 0, .1)',
    },
  };
});

const orgchartHierarchy = (data) => {
  let returnData = []
  if(data) {
    let hierarchy_0 = []
    let hierarchy_1 = []
    let hierarchy_2 = []
    let hierarchy_3 = []

    // eslint-disable-next-line array-callback-return
    data.map((orginfo) => {
      let tmpData = {
        label: orginfo.name,
        sectionKey: sectionKeyMap[String(orginfo.id)].section,
        navigatePath: String(orginfo.id),
        hasChild: sectionKeyMap[String(orginfo.id)].childFlg,
        viewId: sectionKeyMap[String(orginfo.id)].viewidList,
      };

      if (hierarchy_0_List.includes(orginfo.id)) {
        tmpData.indentLevel = 0; // indentLevelを設定
        hierarchy_0.push(tmpData); // tmpDataを配列に追加
      }
      else if (hierarchy_1_List.includes(orginfo.id)) {
        tmpData.indentLevel = 1; // indentLevelを設定
        hierarchy_1.push(tmpData); // tmpDataを配列に追加
      }
      else if (hierarchy_2_List.includes(orginfo.id)) {
        tmpData.indentLevel = 2; // indentLevelを設定
        hierarchy_2.push(tmpData); // tmpDataを配列に追加
      }
      else if (hierarchy_3_List.includes(orginfo.id)) {
        tmpData.indentLevel = 3; // indentLevelを設定
        hierarchy_3.push(tmpData); // tmpDataを配列に追加
      }
    });

    // 各階層を結合
    returnData = [ 
      hierarchy_0,
      hierarchy_1,
      hierarchy_2,
      hierarchy_3,
    ];
  }
  return returnData;
}

const NestedListWithIndentation = ({router}) => {
  const navigate = useNavigate();

  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      // トークンがない場合、ログイン画面にリダイレクト
      const token = localStorage.getItem('token');
      if (!token) {
        navigate("/")
        return
      }
      setTableData(await organizationInfo(navigate)); // 取得したデータをpeopleにセット
    };
    fetchData();
  }, []);

  // 展開状態を管理する
  const [open, setOpen] = useState({
    all: true, // グロウ組織図のみ全展開
    ceo: false,
    backOffice: false, // 初期状態でバックオフィスを展開
    hr: false,
    sesZinzai: false,
    itDept: false, // 開発課の展開状態
    itSol: false, // JAVAの子要素の展開状態
    reSkikking: false,
  });

  // セクションの展開/閉じるトグル関数
  const handleToggle = (section) => {
    setOpen((prevState) => ({ ...prevState, [section]: !prevState[section] }));
  };

  // リストアイテム内に展開ボタンと遷移ボタンを分けて配置する関数
  const renderListItem = (
    label,
    sectionKey,
    navigatePath,
    indentLevel = 0,
    hasChild = false,
    idValue
  ) => {
    // インデントを統一する
    const paddingLeft = indentLevel * 4; // インデントを段階的に追加
    const iconColor = hasChild ? "inherit" : "transparent"; // 子要素がない場合アイコンを透明に
    const handleClick = () => {
      // ローカルストレージにidValueを保存
      localStorage.setItem('selectedId', idValue);
      // ナビゲート先に遷移
      router.navigate("/departmentuser");
    };
    return (
      <ListItemButton sx={{ 
          pl: paddingLeft, 
          "&:hover": {backgroundColor: "transparent"}
      }}>
        {/* アイコンが常に表示され、子要素がない場合アイコンの色を透明に設定 */}
        <ListItemIcon>
          <IconButton
            onClick={() => handleToggle(sectionKey)}
            sx={{
              color: iconColor, // アイコンの色を透明にする
              "&:hover": {
                color: iconColor, // ホバー時も色を変更しない
                backgroundColor: "transparent", // ホバー時の背景色を透明に設定
              },
            }}
          >
            {open[sectionKey] ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
        </ListItemIcon>
        <CustomButton
          variant="outlined"
          color="primary"
          sx={{ ml: 1 , textTransform: 'none'}} // ボタンの間隔を調整
          onClick={ handleClick}
          id = {indentLevel}
        >
          {label}
        </CustomButton>
      </ListItemButton>
    );
  };

const renderItem = (h1, h2) => {
  const item = tableData[h1][h2];
  return renderListItem(
    item.label,
    item.sectionKey,
    item.navigatePath,
    item.indentLevel,
    item.hasChild,
    item.viewId
  );
};

const renderGroup = (h1, h2List) => {
  return h2List.map(h2 => (
    <React.Fragment key={`${h1}-${h2}`}>
      {renderItem(h1, h2)}
    </React.Fragment>
  ));
};


return (
  <Box>
    {tableData.length > 0 && (
      <List component="nav">
        {/* グロウコミュニティ組織図 */}
        {renderItem(0, 0)}

        <Collapse in={open.all} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>

            {/* CEO */}
            {renderItem(1, 0)}
            <Collapse in={open.ceo} timeout="auto" unmountOnExit />

            {/* ソリューション事業部 */}
            {renderItem(1, 1)}
            <Collapse in={open.itDept} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>

                {/* 人材サービス部 */}
                {renderItem(2, 0)}
                <Collapse in={open.sesZinzai} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {renderGroup(3, [1, 0])}
                  </List>
                </Collapse>

                {/* ITソリューション部 */}
                {renderItem(2, 2)}
                <Collapse in={open.itSol} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {renderGroup(3, [2, 5, 3, 4])}
                  </List>
                </Collapse>

                {/* ソリューション営業部 */}
                {renderItem(2, 1)}

              </List>
            </Collapse>

            {/* リスキリング事業部 */}
            {renderItem(1, 4)}
            <Collapse in={open.reSkikking} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {renderGroup(2, [8, 9, 10])}
              </List>
            </Collapse>

            {/* コーポレート管理部 */}
            {renderItem(1, 2)}
            <Collapse in={open.backOffice} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {renderGroup(2, [3, 4, 5])}
              </List>
            </Collapse>

            {/* HR推進部 */}
            {renderItem(1, 3)}
            <Collapse in={open.hr} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {renderGroup(2, [6, 7])}
              </List>
            </Collapse>

          </List>
        </Collapse>
      </List>
    )}
  </Box>
);
};

export default NestedListWithIndentation;
