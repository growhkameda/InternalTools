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
import { styled } from '@mui/system';

const tableData = [
  {id:0,orgname:"グロウコミュニティ組織図",level:"0"},
  {id:1,orgname:"CEO",level:"0_1"},

  {id:2,orgname:"人材サービス事業部",level:"0_2"},
  {id:3,orgname:"営業部",level:"0_2_3"},
  {id:4,orgname:"人材サービス部",level:"0_2_4"},
  {id:5,orgname:"人材サービス課",level:"0_2_4_5"},
  {id:6,orgname:"倉庫課",level:"0_2_4_6"},

  {id:7,orgname:"ITソリューション事業部",level:"0_7"},
  {id:8,orgname:"営業部",level:"0_7_8"},
  {id:9,orgname:"ITソリューション部",level:"0_7_9"},
  {id:10,orgname:"開発課",level:"0_7_9_10"},
  {id:11,orgname:"評価検証課",level:"0_7_9_11"},
  {id:12,orgname:"ITサポート課",level:"0_7_9_12"},

  {id:13,orgname:"コーポレート事業部",level:"0_13"},
  {id:14,orgname:"総務",level:"0_13_14"},
  {id:15,orgname:"経理",level:"0_13_15"},
  {id:16,orgname:"事務",level:"0_13_16"},

  {id:17,orgname:"HR推進部",level:"0_17"},
  {id:18,orgname:"人事",level:"0_17_18"},
  {id:19,orgname:"広報",level:"0_17_19"},

  {id:20,orgname:"リスキリング事業部",level:"0_20"},
  {id:21,orgname:"TechGrowUp",level:"0_20_21"},
  {id:22,orgname:"技術向上課",level:"0_20_22"}
];

const convertLevelData = () => {
  var levelDataDict = {};
  var levelList = [];
  var parentList = [];

  // 階層(レベル)毎のデータリストを作成
  tableData.forEach((item) => {
    var level = Number(item.level.split("_").length);
    if (level in levelDataDict) {
      levelDataDict[level].push(item);
    } else {
      levelDataDict[level] = [item];
      levelList.push(level);
    }
  });

  // データリストを作成。2階層目までを取得
  let levelCnt = 0;
  levelList.forEach((level) => {
    if (levelCnt === 2) return;
    levelDataDict[level].forEach((data) => {
      if (!parentList.includes(data.level)) {
        parentList.push(data.level);
      }
    });
    levelCnt++;
  });

  // 2次元配列として考える: levelList(階層リスト) × parentList(2階層名からの親データ)
  let matrixData = [];
  parentList.forEach((col) => {
    let rowData = [];
    levelList.forEach((row) => {
      let cell = [];
      if (levelDataDict[row]) {
        levelDataDict[row].forEach((data) => {
          if (data.level === col || data.level.startsWith(col + "_")) {
            cell.push(data.level);
          }
        });
      }
      rowData.push(cell);
    });
    matrixData.push({ [col]: rowData });
  });

  // 階層データを基に組織図データを作成
  let makeOrgChartData = [];
  matrixData.forEach((colData) => {
    let col = Object.keys(colData)[0]; // 各親データ(col)を取得
    let rowData = colData[col];
    makeOrgChartData.push(GetNestLevelData(levelDataDict, rowData, 1)); // 再帰的にデータ取得
  });

  return { matrixData, levelList, makeOrgChartData };
};

const GetNestLevelData = (dataDict, parentList, level) => {
  let returnData = [];

  if (dataDict[level]) {
    parentList.forEach((parent) => {
      let children = dataDict[level].filter((data) => data.level.startsWith(parent + "_"));
      if (children.length > 0) {
        let childData = { parent: parent, children: [] };
        children.forEach((child) => {
          childData.children.push(child);
        });
        returnData.push(childData);
      }
    });
  }

  // 再帰処理: 次のレベルのデータを取得
  if (dataDict[level + 1]) {
    returnData.forEach((item) => {
      item.children = GetNestLevelData(dataDict, item.children.map(c => c.level), level + 1);
    });
  }

  return returnData;
};

const CustomButton= styled(Button)(({ id }) => {
  // id に基づいて色を変更
  let gradientColors;
  switch (id) {
    case 0:
      gradientColors = 'linear-gradient(90deg, #2af598 0%, #009efd 100%)'; // 親
      break;
    case 1:
      gradientColors = 'linear-gradient(90deg, #ff7e5f 0%, #feb47b 100%)'; // 子1（オレンジ系）
      break;
    case 2:
      gradientColors = 'linear-gradient(90deg, #6a11cb 0%, #2575fc 100%)'; // 子2（紫・青系）
      break;
    case 3:
      gradientColors = 'linear-gradient(90deg, #56ab2f 0%, #a8e063 100%)'; // 子3（緑系）
      break;
    case 4:
      gradientColors = 'linear-gradient(90deg, #ffecd2 0%, #fcb69f 100%)'; // 子4（淡いピンク系）
      break;
    case 5:
      gradientColors = 'linear-gradient(90deg, #00c6ff 0%, #0072ff 100%)'; // 子5（青系）
      break;
    default:
      gradientColors = 'linear-gradient(90deg, #2af598 0%, #009efd 100%)'; // デフォルト
  }

  return {
    transform: 'skew(-15deg)',
    color: '#fff',
    borderRadius: 0,
    backgroundImage: gradientColors,
    boxShadow: '0 5px 10px rgba(0, 0, 0, .1)',
    minWidth: '200px',
    '&:hover': {
      transform: 'skew(0)',
      boxShadow: '0 2px 3px rgba(0, 0, 0, .1)',
    },
  };
});

const NestedListWithIndentation = () => {
  const navigate = useNavigate();

  // 展開状態を管理する
  const [open, setOpen] = useState({
    all: true,
    ceo: true,
    backOffice: true, // 初期状態でバックオフィスを展開
    hr: true,
    ses: true,
    sesZinzai: true,
    itDept: true, // 開発課の展開状態
    itSol: true, // JAVAの子要素の展開状態
    reSkikking: true,
  });

  // セクションの展開/閉じるトグル関数
  const handleToggle = (section) => {
    setOpen((prevState) => ({ ...prevState, [section]: !prevState[section] }));
  };

  const {levelDataDict, levelList, relParentChildlevelData} = convertLevelData()

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
          sx={{ ml: 1 , textTransform: 'none'}} // ボタンの間隔を調整
          onClick={() => navigate(`/userlist/${navigatePath}`)}
          id = {indentLevel}
        >
          {label}
        </CustomButton>
      </ListItemButton>
    );
  };

  return (
    <Box 
      sx={{ 
        mt: 5,
        backgroundImage: 'url(/org_back.png)',
        backgroundSize: 'cover', // 画像を全体にカバーする
        backgroundPosition: 'center', // 中央に配置
        minHeight: '100vh', // ビューポート全体の高さに設定
      }}
    >
      <List component="nav">
        {renderListItem("グロウコミュニティ組織図", "all", "0", 0, true)}
        <Collapse in={open.all} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {renderListItem("CEO", "ceo", "1", 1, false)}
            <Collapse in={open.ceo} timeout="auto" unmountOnExit />

            {renderListItem("コーポレート事業部", "backOffice", "2", 1, true)}
            <Collapse in={open.backOffice} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {renderListItem("総務", "soumu", "3", 2, false)}
                {renderListItem("経理", "keiri", "4", 2, false)}
                {renderListItem("事務", "zimu", "5", 2, false)}
              </List>
            </Collapse>

            {renderListItem("HR推進部", "hr", "6", 1, true)}
            <Collapse in={open.hr} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {renderListItem("人事", "zinji", "7", 2, false)}
                {renderListItem("広報", "kouhou", "8", 2, false)}
              </List>
            </Collapse>

            {renderListItem("人材サービス事業部", "ses", "9", 1, true)}
            <Collapse in={open.ses} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {renderListItem("営業部", "sesEigyo", "10", 2, false)}
                {renderListItem("人材サービス部", "sesZinzai", "11", 2, true)}
                <Collapse in={open.sesZinzai} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {renderListItem("人材サービス課", "sesZinzai", "12", 3, false)}
                    {renderListItem("倉庫課", "sesSouko", "13", 3, false)}
                  </List>
                </Collapse>
              </List>
            </Collapse>

            {renderListItem("ITソリューション事業部", "itDept", "14", 1, true)}
            <Collapse in={open.itDept} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {renderListItem("営業部", "itEigyo", "15", 2, false)}
                {renderListItem("ITソリューション部", "itSol", "16", 2, true)}
                <Collapse in={open.itSol} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {renderListItem("開発課", "dev", "17", 3, false)}
                    {renderListItem("評価検証課", "test", "18", 3, false)}
                    {renderListItem("ITサポート課", "itHelp", "19", 3, false)}
                  </List>
                </Collapse>
              </List>
            </Collapse>

            {renderListItem("リスキリング事業部", "reSkikking", "20", 1, true)}
            <Collapse in={open.reSkikking} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {renderListItem("TechGrowUp課", "teck", "21", 2, false)}
                {renderListItem("技術向上課", "hr", "22", 2, false)}
              </List>
            </Collapse>

         </List>
        </Collapse>
      </List>
    </Box>
  );
};

export default NestedListWithIndentation;
