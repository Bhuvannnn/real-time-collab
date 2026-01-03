// src/pages/Register.js
import React, { useState } from 'react';
import { TextField, Button, Container, Paper, Typography, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import config from '../config';

function Register() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Basic validation
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            const response = await fetch(`${config.AUTH_URL}/api/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Registration failed');
            }

            // Store the token
            localStorage.setItem('token', data.token);

            // Redirect to documents page
            navigate('/documents');
            
        } catch (err) {
            setError(err.message);
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
                    component="h1" 
                    gutterBottom
                    sx={{ 
                        mb: 3,
                        textAlign: 'center',
                        fontWeight: 600,
                        color: 'text.primary'
                    }}
                >
                    Create Account
                </Typography>
                <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{ mb: 4, textAlign: 'center' }}
                >
                    Join us and start collaborating
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
                        label="Name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        margin="normal"
                        required
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        fullWidth
                        label="Email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        margin="normal"
                        required
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        fullWidth
                        label="Password"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        margin="normal"
                        required
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        fullWidth
                        label="Confirm Password"
                        name="confirmPassword"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
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
                        Create Account
                    </Button>
                    <Typography 
                        variant="body2" 
                        sx={{ 
                            textAlign: 'center',
                            color: 'text.secondary'
                        }}
                    >
                        Already have an account?{' '}
                        <Link 
                            href="/login" 
                            onClick={(e) => {
                                e.preventDefault();
                                navigate('/login');
                            }}
                            sx={{ 
                                fontWeight: 500,
                                textDecoration: 'none',
                                '&:hover': {
                                    textDecoration: 'underline'
                                }
                            }}
                        >
                            Sign in here
                        </Link>
                    </Typography>
                </form>
            </Paper>
        </Container>
    );
}

export default Register;