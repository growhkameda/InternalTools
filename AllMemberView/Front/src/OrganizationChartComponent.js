import React, { useState } from "react";
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

const tableData = [
  {id:0,orgname:"Grow組織図",lebel:"0"},
  {id:1,orgname:"CEO",lebel:"0_1"},

  {id:2,orgname:"人材サービス事業部",lebel:"0_2"},
  {id:3,orgname:"営業部",lebel:"0_2_3"},
  {id:4,orgname:"人材サービス部",lebel:"0_2_4"},
  {id:5,orgname:"人材サービス課",lebel:"0_2_4_5"},
  {id:6,orgname:"倉庫課",lebel:"0_2_4_6"},

  {id:7,orgname:"ITソリューション事業部",lebel:"0_7"},
  {id:8,orgname:"営業部",lebel:"0_6_8"},
  {id:9,orgname:"ITソリューション部",lebel:"0_6_9"},
  {id:10,orgname:"開発課",lebel:"0_6_9_10"},
  {id:11,orgname:"評価検証課",lebel:"0_6_9_11"},
  {id:12,orgname:"ITサポート課",lebel:"0_6_9_12"},

  {id:13,orgname:"コーポレート事業部",lebel:"0_13"},
  {id:14,orgname:"総務",lebel:"0_13_14"},
  {id:15,orgname:"経理",lebel:"0_13_15"},
  {id:16,orgname:"事務",lebel:"0_13_16"},

  {id:17,orgname:"HR推進部",lebel:"0_17"},
  {id:18,orgname:"人事",lebel:"0_17_18"},
  {id:19,orgname:"広報",lebel:"0_17_19"},

  {id:20,orgname:"リスキリング事業部",lebel:"0_20"},
  {id:21,orgname:"TechGrowUp",lebel:"0_20_21"},
  {id:22,orgname:"技術向上課",lebel:"0_20_22"}
];

const convertLevelData = () => {
  var lebelDataDict = {}
  tableData.map((item) => {
    var lebel = item.lebel.split("_").length
    if(lebel in lebelDataDict) {
      lebelDataDict[lebel].push(item)
    }
    else {
      lebelDataDict[lebel] = new Array(item)
    }
  });
  return lebelDataDict
}


const NestedListWithIndentation = () => {
  const navigate = useNavigate();

  // 展開状態を管理する
  const [open, setOpen] = useState({
    all: true,
    ceo: true,
    backOffice: true, // 初期状態でバックオフィスを展開
    itDept: true,
    reskillDept: false,
    staffingDept: false,
    development: true, // 開発課の展開状態
    java: true, // JAVAの子要素の展開状態
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
    hasChild = false
  ) => {
    // インデントを統一する
    const paddingLeft = indentLevel * 4; // インデントを段階的に追加
    const iconColor = hasChild ? "inherit" : "transparent"; // 子要素がない場合アイコンを透明に
    convertLevelData()
    return (
      <ListItemButton sx={{ pl: paddingLeft }}>
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
        <Button
          variant="outlined"
          sx={{ ml: 1 }} // ボタンの間隔を調整
          onClick={() => navigate(navigatePath)}
        >
          {label}
        </Button>
      </ListItemButton>
    );
  };

  return (
    <Box sx={{ mt: 5 }}>
      <List component="nav">
        {/* 組織図 */}
        {renderListItem("グロウコミュニティ組織図", "all", "/all", 0, true)}
        <Collapse in={open.all} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {/* CEO */}
            {renderListItem("CEO", "ceo", "/ceo", 1, false)}
            <Collapse in={open.ceo} timeout="auto" unmountOnExit />

            {/* バックオフィス */}
            {renderListItem("バックオフィス", "backOffice", "/back-office", 1, true)}
            <Collapse in={open.backOffice} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {renderListItem("経理・事務", "keiri", "/keiri", 2, false)}
                {renderListItem("人事", "hr", "/hr", 2, false)}
                {renderListItem("営業", "sales", "/sales", 2, false)}
                {renderListItem("広報", "jarnal", "/jarnal", 2, false)}
              </List>
            </Collapse>

            {/* ITソリューション事業部 */}
            {renderListItem("ITソリューション事業部", "itDept", "/it-dept", 1, true)}
            <Collapse in={open.itDept} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {/* 開発課 */}
                {renderListItem("開発課", "development", "/development", 2, true)}
                <Collapse in={open.development} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {renderListItem("C", "c-development", "/c-development", 3, false)}
                    {renderListItem("Java", "java", "/java-development", 3, true)}
                    <Collapse in={open.java} timeout="auto" unmountOnExit>
                      <List component="div" disablePadding>
                        {renderListItem("Spring", "Spring-development", "/Spring-development", 4, false)}
                        {renderListItem("Boot", "boot-development", "/boot-development", 4, false)}
                      </List>
                    </Collapse>
                  </List>
                </Collapse>
                {/* 他の部署 */}
                {renderListItem("評価検証課", "testing", "/testing", 2, false)}
                {renderListItem("ITサポート課", "staffing", "/staffing", 2, false)}
              </List>
            </Collapse>

         </List>
        </Collapse>
      </List>
    </Box>
  );
};

export default NestedListWithIndentation;
