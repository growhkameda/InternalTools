import React, { useState } from 'react';
import { Box, Card, CardContent, CardMedia, Typography, TextField, Button, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import StarIcon from '@mui/icons-material/Star';
import { useNavigate } from 'react-router-dom'; // 追加

// サンプルデータ
const people = [
  { id: 1, name: '佐藤 太郎', position: '事務経理', image: 'https://randomuser.me/api/portraits/men/1.jpg' },
  { id: 2, name: '鈴木 花子', position: '事務経理', image: 'https://randomuser.me/api/portraits/women/2.jpg' },
  { id: 3, name: '田中 一郎', position: '事務経理', image: 'https://randomuser.me/api/portraits/men/3.jpg' },
  { id: 4, name: '山田 次郎', position: '事務経理', image: 'https://randomuser.me/api/portraits/women/4.jpg' },
  { id: 5, name: '井上 三郎', position: '事務経理', image: 'https://randomuser.me/api/portraits/men/5.jpg' },
  { id: 6, name: '小林 四郎', position: '事務経理', image: 'https://randomuser.me/api/portraits/men/6.jpg' },
  { id: 7, name: '森 さくら', position: '事務経理', image: 'https://randomuser.me/api/portraits/women/7.jpg' },
  { id: 8, name: '高橋 桃子', position: '事務経理', image: 'https://randomuser.me/api/portraits/women/8.jpg' },
  { id: 9, name: '佐藤 太郎', position: '事務経理', image: 'https://randomuser.me/api/portraits/men/1.jpg' },
  { id: 10, name: '鈴木 花子', position: '事務経理', image: 'https://randomuser.me/api/portraits/women/2.jpg' },
  { id: 11, name: '田中 一郎', position: '事務経理', image: 'https://randomuser.me/api/portraits/men/3.jpg' },
  { id: 12, name: '山田 次郎', position: '事務経理', image: 'https://randomuser.me/api/portraits/women/4.jpg' },
  { id: 13, name: '井上 三郎', position: '事務経理', image: 'https://randomuser.me/api/portraits/men/5.jpg' },
  { id: 14, name: '小林 四郎', position: '事務経理', image: 'https://randomuser.me/api/portraits/men/6.jpg' },
  { id: 15, name: '森 さくら', position: '事務経理', image: 'https://randomuser.me/api/portraits/women/7.jpg' },
  { id: 16, name: '高橋 桃子', position: '事務経理', image: 'https://randomuser.me/api/portraits/women/8.jpg' },
  { id: 17, name: '佐藤 太郎', position: '事務経理', image: 'https://randomuser.me/api/portraits/men/1.jpg' },
  { id: 18, name: '鈴木 花子', position: '事務経理', image: 'https://randomuser.me/api/portraits/women/2.jpg' },
  { id: 19, name: '田中 一郎', position: '事務経理', image: 'https://randomuser.me/api/portraits/men/3.jpg' },
  { id: 20, name: '山田 次郎', position: '事務経理', image: 'https://randomuser.me/api/portraits/women/4.jpg' },
  { id: 21, name: '井上 三郎', position: '事務経理', image: 'https://randomuser.me/api/portraits/men/5.jpg' },
  { id: 22, name: '小林 四郎', position: '事務経理', image: 'https://randomuser.me/api/portraits/men/6.jpg' },
  { id: 23, name: '森 さくら', position: '事務経理', image: 'https://randomuser.me/api/portraits/women/7.jpg' },
  { id: 24, name: '高橋 桃子', position: '事務経理', image: 'https://randomuser.me/api/portraits/women/8.jpg' },
];

const PeopleList = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 20; // 4×5のレイアウト
    const navigate = useNavigate(); // useNavigateフックを使用
  
    // フリーワード検索
    const filteredPeople = people.filter(person =>
      person.name.includes(searchTerm) || person.position.includes(searchTerm)
    );
  
    // 現在のページに表示するデータを取得
    const displayedPeople = filteredPeople.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);
  
    // 次のページに進む関数
    const handleNextPage = () => {
      if ((currentPage + 1) * itemsPerPage < filteredPeople.length) {
        setCurrentPage(currentPage + 1);
      }
    };
  
    // 前のページに戻る関数
    const handlePreviousPage = () => {
      if (currentPage > 0) {
        setCurrentPage(currentPage - 1);
      }
    };
  
    // 社員詳細ページに遷移する関数
    const handleCardClick = (id) => {
      navigate(`/user/${id}`); // クリックされた社員の詳細ページに遷移
    };
  
    return (
      <Box sx={{ padding: 2 }}>
        {/* フリーワード検索用のテキストフィールド、虫眼鏡マーク付き */}
        <TextField
          label="検索"
          variant="outlined"
          fullWidth
          sx={{ marginBottom: 2 }}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
  
        {/* 4×5レイアウトのCSS Grid */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)', // 4列
            gap: 2,
          }}
        >
          {displayedPeople.map((person) => (
            <Card
              key={person.id}
              onClick={() => handleCardClick(person.id)}
              sx={{ cursor: 'pointer' }}
            >
              <CardMedia
                component="img"
                height="150"
                image={person.image}
                alt={person.name}
              />
              <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
                {/* 名前の左にステータスアイコンを表示 */}
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  {person.id === 1 && <StarIcon sx={{ color: 'gold', marginRight: '8px' }} />}
                  <Box>
                    <Typography variant="h6">{person.name}</Typography>
                    <Typography variant="subtitle1">{person.position}</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
  
        {/* ページ移動ボタン */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
          <Button variant="contained" onClick={handlePreviousPage} disabled={currentPage === 0}>
            前へ
          </Button>
          <Button
            variant="contained"
            onClick={handleNextPage}
            disabled={(currentPage + 1) * itemsPerPage >= filteredPeople.length}
          >
            次へ
          </Button>
        </Box>
      </Box>
    );
  };
  
  export default PeopleList;