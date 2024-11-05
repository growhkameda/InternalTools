import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Select,
  MenuItem,
  IconButton,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import * as XLSX from 'xlsx';

const NewProjectForm = () => {
  const [projects, setProjects] = useState([]); // 手動で追加されたプロジェクトとエクセルから読み込んだプロジェクトのリスト

  // テーブルの編集行を追加するための関数
  const handleAddRow = () => {
    setProjects((prevProjects) => [
      ...prevProjects,
      { projectName: '', type: '', location: '' }, // 新しい空の行を追加
    ]);
  };

  // 各セルの入力変更をハンドルする関数
  const handleInputChange = (index, event) => {
    const { name, value } = event.target;
    setProjects((prevProjects) => {
      const updatedProjects = [...prevProjects];
      updatedProjects[index][name] = value;
      return updatedProjects;
    });
  };

  // 行を削除するための関数
  const handleDeleteRow = (index) => {
    setProjects((prevProjects) => prevProjects.filter((_, i) => i !== index));
  };

  // エクセルファイルを読み込んで、内容を編集可能な行として反映する
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const arrayBuffer = e.target.result;
        const workbook = XLSX.read(arrayBuffer, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        const projectList = data.map((row) => ({
          projectName: row[0] || '',
          type: row[1] || '',
          location: row[2] || '',
        }));
        setProjects((prevProjects) => [...prevProjects, ...projectList]);
      };
      reader.readAsArrayBuffer(file);
    }
  };

  // 登録ボタンを押したときに全てのプロジェクトをまとめて処理
  const handleSubmit = () => {
    console.log('新規登録されたプロジェクト情報:', projects);
    // APIに送信する処理を追加
  };

  return (
    <Box padding={3}>
      <Card variant="outlined" sx={{ boxShadow: 3 }}>
        <CardHeader title="新規プロジェクト登録" subheader="必要な情報を入力するか、エクセルから読み込んでください" />
        <Divider />
        <CardContent>
          {/* テーブル表示 */}
          <Table sx={{ mt: 4 }}>
            <TableHead>
              <TableRow>
                <TableCell>案件名</TableCell>
                <TableCell>種類</TableCell>
                <TableCell>現場先</TableCell>
                <TableCell>操作</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {projects.map((project, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <TextField
                      variant="outlined"
                      name="projectName"
                      label="案件名"
                      value={project.projectName}
                      onChange={(e) => handleInputChange(index, e)}
                      fullWidth
                    />
                  </TableCell>
                  <TableCell>
                    <Select
                      value={project.type}
                      onChange={(e) => handleInputChange(index, e)}
                      name="type"
                      fullWidth
                    >
                      <MenuItem value="開発">開発</MenuItem>
                      <MenuItem value="保守">保守</MenuItem>
                      <MenuItem value="運用">運用</MenuItem>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <TextField
                      variant="outlined"
                      name="location"
                      label="現場先"
                      value={project.location}
                      onChange={(e) => handleInputChange(index, e)}
                      fullWidth
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleDeleteRow(index)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* 行を追加するボタン */}
          <Button variant="contained" color="secondary" onClick={handleAddRow} sx={{ mt: 2 }}>
            行を追加
          </Button>

          {/* エクセルファイルを読み込むための入力 */}
          <Button variant="outlined" component="label" sx={{ mt: 2, ml: 2 }}>
            エクセルファイルを選択
            <input
              type="file"
              accept=".xlsx, .xls"
              hidden
              onChange={handleFileChange}
            />
          </Button>
        </CardContent>
        <Divider />
        <Box display="flex" justifyContent="flex-end" padding={2}>
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            登録
          </Button>
        </Box>
      </Card>
    </Box>
  );
};

export default NewProjectForm;
