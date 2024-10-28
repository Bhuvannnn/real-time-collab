import React, { useState } from 'react';
import { TextField, Button, Container, Paper, Typography, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(email, password);
            navigate('/documents');
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <Container maxWidth="sm">
            <Paper sx={{ p: 3, mt: 8 }}>
                <Typography variant="h5" gutterBottom>Login</Typography>
                {error && <Typography color="error">{error}</Typography>}
                <form onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        label="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        margin="normal"
                    />
                    <TextField
                        fullWidth
                        type="password"
                        label="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        margin="normal"
                    />
                    <Button 
                        fullWidth 
                        variant="contained" 
                        type="submit" 
                        sx={{ mt: 2 }}
                    >
                        Login
                    </Button>
                </form>
                <Typography sx={{ mt: 2, textAlign: 'center' }}>
                    Don't have an account?{' '}
                    <Link 
                        href="/register" 
                        onClick={(e) => {
                            e.preventDefault();
                            navigate('/register');
                        }}
                    >
                        Register here
                    </Link>
                </Typography>
            </Paper>
        </Container>
    );
}

export default Login;