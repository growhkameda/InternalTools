import React, { useState, useEffect } from "react";
import { Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import axios from "axios";

const AdminPageLayout = ({ token }) => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
      const fetchUsers = async () => {
          try {
              const response = await axios.get("/api/alluserinfo", {
                  headers: {
                      "Authorization": `Bearer ${token}`,
                  },
              });
              setUsers(response.data);
          } catch (error) {
              console.error("There was an error fetching the users!", error);
          }
    };

    fetchUsers();
  }, []);

return (
<Box sx={{ display: "flex", height: "100vh" }}>
{/* 左側（縦2分割の左） */}
<Box
sx={{
flex: 1,
display: "flex",
justifyContent: "center",
alignItems: "center",
}}
>
<Paper
elevation={3}
sx={{
width: "90%",
height: "90%",
display: "flex",
justifyContent: "center",
alignItems: "center",
}}
>
ユーザー一覧
<TableContainer component={Paper}>
  <Table sx={{ minWidth: 650 }} aria-label="simple table">
    <TableHead>
      <TableRow>
         <TableCell>名前</TableCell>
         </TableRow>
          </TableHead>
           <TableBody>
             {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                </TableRow>
               ))}
           </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  </Box>
   );
};

export default AdminPageLayout;
