import React, { useState } from 'react';
import { TextField, Button, Container, Paper, Typography, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import config from '../config';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${config.AUTH_URL}/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Login failed');
            }

            // Store both token and user ID
            localStorage.setItem('token', data.token);
            localStorage.setItem('userId', data.user.id); // Store user ID
            
            navigate('/documents');
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <Container 
            maxWidth="sm" 
            sx={{ 
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                py: 4
            }}
        >
            <Paper 
                elevation={2}
                sx={{ 
                    p: 4, 
                    width: '100%',
                    maxWidth: 440
                }}
            >
                <Typography 
                    variant="h4" 
                    gutterBottom 
                    sx={{ 
                        mb: 3,
                        textAlign: 'center',
                        fontWeight: 600,
                        color: 'text.primary'
                    }}
                >
                    Welcome Back
                </Typography>
                <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{ mb: 4, textAlign: 'center' }}
                >
                    Sign in to continue to your workspace
                </Typography>
                
                {error && (
                    <Typography 
                        color="error" 
                        sx={{ 
                            mb: 2,
                            p: 1.5,
                            bgcolor: 'error.light',
                            borderRadius: 2,
                            textAlign: 'center'
                        }}
                    >
                        {error}
                    </Typography>
                )}
                
                <form onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        label="Email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        margin="normal"
                        required
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        fullWidth
                        type="password"
                        label="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        margin="normal"
                        required
                        sx={{ mb: 3 }}
                    />
                    <Button 
                        fullWidth 
                        variant="contained" 
                        type="submit" 
                        size="large"
                        sx={{ 
                            mt: 1,
                            mb: 3,
                            py: 1.5
                        }}
                    >
                        Sign In
                    </Button>
                </form>
                
                <Typography 
                    variant="body2" 
                    sx={{ 
                        textAlign: 'center',
                        color: 'text.secondary'
                    }}
                >
                    Don't have an account?{' '}
                    <Link 
                        href="/register" 
                        onClick={(e) => {
                            e.preventDefault();
                            navigate('/register');
                        }}
                        sx={{ 
                            fontWeight: 500,
                            textDecoration: 'none',
                            '&:hover': {
                                textDecoration: 'underline'
                            }
                        }}
                    >
                        Create one here
                    </Link>
                </Typography>
            </Paper>
        </Container>
    );
}

export default Login;