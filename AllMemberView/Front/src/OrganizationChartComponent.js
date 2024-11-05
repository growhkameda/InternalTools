import React from "react";
import { OrganizationChart } from "primereact/organizationchart";
import { Button, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

const customButtonStyle = {
  padding: "10px 20px",
  borderRadius: "8px",
  backgroundColor: "#3f51b5",
  color: "#fff",
  border: "none",
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  transition: "transform 0.2s ease-in-out",
  "&:hover": {
    transform: "scale(1.05)",
  },
};

const boxStyle = {
  backgroundColor: "#f5f5f5",
  padding: "10px",
  borderRadius: "8px",
  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  textAlign: "center",
  marginBottom: "20px",
  width: "200px", // 幅を統一
};

const OrganizationChartDemo = () => {
  const navigate = useNavigate();

  // 社員詳細ページに遷移する関数
  const handleCardClick = (id) => {
    navigate(`/userlist/${id}`); // クリックされた社員の詳細ページに遷移
  };

  const data = [
    {
      label: (
        <Box sx={boxStyle} style={{ marginBottom: "10px" }}>
          <Button
            variant="contained"
            sx={customButtonStyle}
            onClick={() => navigate("/ceo")}
          >
            CEO
          </Button>
        </Box>
      ),
      expanded: true,
      children: [
        {
          label: <Box sx={boxStyle}>バックオフィス</Box>,
          expanded: true,
          children: [
            {
              label: (
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <Button
                    variant="contained"
                    sx={customButtonStyle}
                    onClick={() => handleCardClick(1)}
                    style={{ marginBottom: "10px" }}
                  >
                    経理・事務
                  </Button>
                  <Button
                    variant="contained"
                    sx={customButtonStyle}
                    onClick={() => navigate("/hr")}
                    style={{ marginBottom: "10px" }}
                  >
                    人事
                  </Button>
                  <Button
                    variant="contained"
                    sx={customButtonStyle}
                    onClick={() => navigate("/sales")}
                    style={{ marginBottom: "10px" }}
                  >
                    営業
                  </Button>
                  <Button
                    variant="contained"
                    sx={customButtonStyle}
                    onClick={() => navigate("/sales")}
                    style={{ marginBottom: "10px" }}
                  >
                    広報
                  </Button>
                </Box>
              ),
            },
          ],
        },
        {
          label: <Box sx={boxStyle}>ITソリューション事業部</Box>,
          expanded: true,
          children: [
            {
              label: (
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <Button
                    variant="contained"
                    sx={customButtonStyle}
                    onClick={() => navigate("/development")}
                    style={{ marginBottom: "10px" }}
                  >
                    開発課
                  </Button>
                  <Button
                    variant="contained"
                    sx={customButtonStyle}
                    onClick={() => navigate("/testing")}
                    style={{ marginBottom: "10px" }}
                  >
                    評価検証課
                  </Button>
                  <Button
                    variant="contained"
                    sx={customButtonStyle}
                    onClick={() => navigate("/staffing")}
                    style={{ marginBottom: "10px" }}
                  >
                    ITサポート課
                  </Button>
                </Box>
              ),
            },
          ],
        },
        {
          label: <Box sx={boxStyle}>リスキリング事業部</Box>,
          expanded: true,
          children: [
            {
              label: (
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <Button
                    variant="contained"
                    sx={customButtonStyle}
                    onClick={() => navigate("/tech")}
                    style={{ marginBottom: "10px" }}
                  >
                    テックグロウアップ課
                  </Button>
                  <Button
                    variant="contained"
                    sx={customButtonStyle}
                    onClick={() => navigate("/skill")}
                    style={{ marginBottom: "10px" }}
                  >
                    技術向上課
                  </Button>
                </Box>
              ),
            },
          ],
        },
        {
          label: <Box sx={boxStyle}>人材サービス事業部</Box>,
          expanded: true,
          children: [
            {
              label: (
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <Button
                    variant="contained"
                    sx={customButtonStyle}
                    onClick={() => navigate("/development")}
                    style={{ marginBottom: "10px" }}
                  >
                    人材サービス課
                  </Button>
                  <Button
                    variant="contained"
                    sx={customButtonStyle}
                    onClick={() => navigate("/testing")}
                    style={{ marginBottom: "10px" }}
                  >
                    倉庫課
                  </Button>
                </Box>
              ),
            },
          ],
        },
      ],
    },
  ];

  const nodeTemplate = (node) => {
    return <div>{node.label}</div>;
  };

  return (
    <Box
      sx={{
        mt: 5,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        gap: 4, // ボタン間のスペース
      }}
    >
      <OrganizationChart
        value={data}
        nodeTemplate={nodeTemplate}
        className="custom-organization-chart"
        style={{
          textAlign: "center",
          border: "none",
          backgroundColor: "transparent",
        }}
      />
    </Box>
  );
};

export default OrganizationChartDemo;
