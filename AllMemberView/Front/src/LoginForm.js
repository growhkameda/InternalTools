import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();  // useNavigateフックを使用

    const handleLogin = async (e) => {
        e.preventDefault();  // フォームのデフォルトの動作を防ぐ

        try {
            const response = await axios.post('http://localhost:8080/api/auth/login', {
                email: email,
                password: password,
            });

            const token = response.data.token;  // サーバーからのトークンを取得
            localStorage.setItem('token', token);  // トークンをローカルストレージに保存

            // ログイン成功後にユーザーリストに遷移
            navigate('/userlist');  // /userlist に遷移
        } catch (err) {
            setError('Invalid username or password');
            console.error('Login error', err);
        }
    };

    return (
        <form onSubmit={handleLogin}>
            <div>
                <label>Email:</label>
                <input 
                    type="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    required 
                />
            </div>
            <div>
                <label>Password:</label>
                <input 
                    type="password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    required 
                />
            </div>
            {error && <div style={{ color: 'red' }}>{error}</div>}
            <button type="submit">Login</button>
        </form>
    );
};

export default LoginForm;
