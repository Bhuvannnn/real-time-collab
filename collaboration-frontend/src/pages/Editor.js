// src/pages/Editor.js
import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
    Container, 
    Paper, 
    Typography, 
    CircularProgress, 
    Box,
    AppBar,
    Toolbar,
    IconButton,
    Chip,
} from '@mui/material';
import { ArrowBack as ArrowBackIcon, Edit as EditIcon } from '@mui/icons-material';
import Editor from '@monaco-editor/react';
import io from 'socket.io-client';
import ActiveUsers from '../components/ActiveUsers';
import config from '../config';

function DocumentEditor() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [socket, setSocket] = useState(null);
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(true);
    const [document, setDocument] = useState(null);
    const [activeUsers, setActiveUsers] = useState([]);
    const typingTimeoutRef = useRef(null);
    const ignoreNextChangeRef = useRef(false);
    const isTypingRef = useRef(false);
    const [hasWritePermission, setHasWritePermission] = useState(true);


    // Initialize socket connection
    useEffect(() => {
        const token = localStorage.getItem('token');
        const newSocket = io(config.SOCKET_URL, {
            auth: { token },
            transports: ['websocket']
        });

        newSocket.on('connect', () => {
            console.log('Connected to socket server');
            newSocket.emit('join-document', id);
        });

        newSocket.on('document-changed', (data) => {
            console.log('Received change:', data);
            if (data.userId !== newSocket.id) {
                ignoreNextChangeRef.current = true;
                setContent(data.changes.text);
            }
        });

        newSocket.on('active-users', (data) => {
            console.log('Active users update:', data);
            setActiveUsers(data.users);
        });

        setSocket(newSocket);

        return () => {
            if (newSocket) {
                newSocket.disconnect();
            }
        };
    }, [id]);

    // Load initial document content
    useEffect(() => {
        const loadDocument = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem('token');
                const response = await fetch(`${config.DOCUMENT_URL}/api/documents/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                
                if (!response.ok) {
                    throw new Error('Failed to load document');
                }

                const data = await response.json();
                setDocument(data);
                setContent(data.content || '');
                const currentUserId = JSON.parse(atob(token.split('.')[1])).userId;
                const isOwner = data.owner === currentUserId;
                
                // Check if user has write permission
                const userCollaborator = data.collaborators.find(c => c.userId === currentUserId);
                setHasWritePermission(isOwner || (userCollaborator?.permission === 'write'));
                
                setLoading(false);
            } catch (error) {
                console.error('Error loading document:', error);
                setLoading(false);
            }
        };

        loadDocument();
    }, [id]);

    const startTyping = () => {
        if (!isTypingRef.current && socket) {
            isTypingRef.current = true;
            socket.emit('typing-start', id);
        }

        // Clear any existing timeout
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }

        // Set new timeout
        typingTimeoutRef.current = setTimeout(() => {
            if (isTypingRef.current && socket) {
                isTypingRef.current = false;
                socket.emit('typing-end', id);
            }
        }, 2000); // Increased timeout to 2 seconds
    };

    const handleEditorChange = (newValue) => {
        if (ignoreNextChangeRef.current) {
            ignoreNextChangeRef.current = false;
            return;
        }

        setContent(newValue);
        startTyping();
        
        if (socket) {
            socket.emit('document-change', {
                documentId: id,
                changes: {
                    text: newValue,
                    timestamp: new Date().toISOString()
                }
            });
        }

        saveDocument(newValue);
    };

    // Cleanup typing timeout on unmount
    useEffect(() => {
        return () => {
            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
            }
        };
    }, []);

    // Debounced save function
    const saveDocument = React.useCallback(
        debounce(async (newContent) => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`${config.DOCUMENT_URL}/api/documents/${id}`, {
                    method: 'PATCH',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        content: newContent
                    })
                });

                if (!response.ok) {
                    throw new Error('Failed to save document');
                }
            } catch (error) {
                console.error('Error saving document:', error);
            }
        }, 1000),
        [id]
    );

    if (loading) {
        return (
            <Box 
                sx={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center',
                    minHeight: '100vh'
                }}
            >
                <CircularProgress />
            </Box>
        );
    }

    return (
        <>
            <AppBar 
                position="sticky" 
                color="default" 
                elevation={0}
                sx={{ 
                    borderBottom: '1px solid',
                    borderColor: 'divider'
                }}
            >
                <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 2, sm: 3 } }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <IconButton 
                            onClick={() => navigate('/documents')}
                            sx={{ color: 'text.primary' }}
                        >
                            <ArrowBackIcon />
                        </IconButton>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                            {document?.title || 'Untitled Document'}
                        </Typography>
                        {!hasWritePermission && (
                            <Chip 
                                label="Read Only" 
                                size="small" 
                                icon={<EditIcon />}
                                sx={{ 
                                    bgcolor: 'warning.light',
                                    color: 'warning.dark'
                                }} 
                            />
                        )}
                    </Box>
                    <ActiveUsers users={activeUsers} />
                </Toolbar>
            </AppBar>
            
            <Container maxWidth="xl" sx={{ mt: 0, mb: 4, px: { xs: 2, sm: 3 } }}>
                <Paper 
                    elevation={0}
                    sx={{ 
                        mt: 3,
                        minHeight: 'calc(100vh - 200px)',
                        borderRadius: 3,
                        overflow: 'hidden',
                        border: '1px solid',
                        borderColor: 'divider'
                    }}
                >
                    <Box sx={{ height: 'calc(100vh - 200px)' }}>
                        <Editor
                            height="100%"
                            defaultLanguage="plaintext"
                            value={content}
                            onChange={hasWritePermission ? handleEditorChange : undefined}
                            options={{
                                minimap: { enabled: false },
                                wordWrap: 'on',
                                lineNumbers: 'on',
                                glyphMargin: false,
                                folding: false,
                                readOnly: !hasWritePermission,
                                fontSize: 14,
                                fontFamily: 'Monaco, Menlo, "Courier New", monospace',
                                padding: { top: 20, bottom: 20 },
                                scrollBeyondLastLine: false,
                            }}
                            theme="vs"
                        />
                    </Box>
                </Paper>
            </Container>
        </>
    );
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

export default DocumentEditor;