// src/pages/Editor.js
import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Paper, Typography, CircularProgress } from '@mui/material';
import Editor from '@monaco-editor/react';
import io from 'socket.io-client';
import ActiveUsers from '../components/ActiveUsers';
import config from '../config';

function DocumentEditor() {
    const { id } = useParams();
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
            <Container sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <CircularProgress />
            </Container>
        );
    }

    return (
        <Container maxWidth="lg">
            <Paper sx={{ p: 3, mt: 4, minHeight: '600px' }}>
                <Typography variant="h5" gutterBottom>
                    {document?.title || 'Loading...'}
                </Typography>
                
                <ActiveUsers users={activeUsers} />
                
                <Editor
                    height="500px"
                    defaultLanguage="plaintext"
                    value={content}
                    onChange={hasWritePermission ? handleEditorChange : undefined}
                    options={{
                        minimap: { enabled: false },
                        wordWrap: 'on',
                        lineNumbers: 'off',
                        glyphMargin: false,
                        folding: false,
                        lineDecorationsWidth: 0,
                        lineNumbersMinChars: 0,
                        readOnly: !hasWritePermission
                    }}
                />
            </Paper>
        </Container>
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