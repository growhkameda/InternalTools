import { Button, Box, Paper, IconButton } from "@mui/material";
import { useState, useEffect } from "react";
import { alluserInfo } from "../components/MemberListComponent";

const Home = () => {
  // 現在の西暦と月を取得
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1; 

  const [employees, setEmployees] = useState([]);   // フィルター後の社員を格納
  const [year, setYear] = useState(currentYear);    // 現在の西暦を初期値に格納
  const [month, setMonth] = useState(currentMonth); // 現在の月を初期値に格納
  const [loading, setLoading] = useState(false);    // ローディング状態
  const [error, setError] = useState(null);         // エラーメッセージ

  // トークンの取得（仮の値を入れているので適宜修正してね）
  const token = "your_token_here"; 

  // fetchEmployees APIから今月の社員を取得
  useEffect(() => {
    const fetchEmployees = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `/api/users-by-newEmployee?year=${year}&month=${month}`,
          {
            method: "GET",
            headers: {
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json"
            }
          }
        );

        if (!response.ok) {
          throw new Error(`APIエラー: ${response.statusText}`);
        }

        const data = await response.json();
        setEmployees(data);   // 取得した社員データをセットする
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };