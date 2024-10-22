import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchUsers = async () => {
            const token = localStorage.getItem('token'); // ローカルストレージからトークンを取得
            console.log('Token:', token); // トークンをコンソールに出力
            
            try {
                const response = await axios.get('http://localhost:8080/api/auth/alluserinfo', {
                    headers: {
                        Authorization: `Bearer ${token}`, // トークンをヘッダーに追加
                    },
                });
                setUsers(response.data); // ユーザー一覧をセット
            } catch (err) {
                setError('Failed to fetch user data');
                console.error('Error fetching users', err);
            }
        };

        fetchUsers();
    }, []); // コンポーネントがマウントされたときに実行

    return (
        <div>
            <h2>User List</h2>
            {error && <div style={{ color: 'red' }}>{error}</div>}
            <ul>
                {users.map(user => (
                    <li key={user.user_id}>
                        {user.user_name} ({user.memo})
                    </li> // ユーザー名とメールアドレスを表示
                ))}
            </ul>
        </div>
    );
};

export default UserList;
