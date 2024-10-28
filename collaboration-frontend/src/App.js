import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Login from './pages/Login';  // Make sure this matches exactly
import Documents from './pages/Documents';
import Editor from './pages/Editor';
import Register from './pages/Register';
function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/documents" element={<Documents />} />
                    <Route path="/editor/:id" element={<Editor />} />
                    <Route path="/register" element={<Register />} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;