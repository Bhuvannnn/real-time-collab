// src/pages/Documents.js (Frontend)
import React, { useEffect, useState } from 'react';
import { 
    Container, 
    Paper, 
    Typography, 
    Button, 
    List, 
    ListItem, 
    ListItemText,
    IconButton 
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ShareDialog from '../components/ShareDialog';

function Documents() {
    const [documents, setDocuments] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const [selectedDoc, setSelectedDoc] = useState(null);
    const [shareDialogOpen, setShareDialogOpen] = useState(false);

    useEffect(() => {
        loadDocuments();
    }, []);

    const loadDocuments = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:3002/api/documents', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            setDocuments(data);
        } catch (error) {
            console.error('Error loading documents:', error);
            setError('Failed to load documents');
        }
    };

    const createNewDocument = async () => {
        try {
            const token = localStorage.getItem('token');
            await fetch('http://localhost:3002/api/documents', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    title: `New Document ${new Date().toLocaleString()}`,
                    content: ''
                })
            });
            loadDocuments(); // Reload the documents list
        } catch (error) {
            console.error('Error creating document:', error);
            setError('Failed to create document');
        }
    };

    const handleShare = (doc) => {
        setSelectedDoc(doc);
        setShareDialogOpen(true);
    };

    const handleShareComplete = () => {
        setShareDialogOpen(false);
        loadDocuments(); // Reload documents to update sharing status
    };

    return (
        <Container maxWidth="md">
            <Paper sx={{ p: 3, mt: 8 }}>
                <Typography variant="h5" gutterBottom>My Documents</Typography>
                {error && (
                    <Typography color="error" sx={{ mb: 2 }}>
                        {error}
                    </Typography>
                )}
                <Button 
                    variant="contained" 
                    onClick={createNewDocument} 
                    sx={{ mb: 2 }}
                >
                    Create New Document
                </Button>
                <List>
                    {documents.map((doc) => (
                        <ListItem 
                            key={doc._id}
                            sx={{
                                border: '1px solid #eee',
                                mb: 1,
                                borderRadius: 1,
                                '&:hover': {
                                    backgroundColor: '#f5f5f5'
                                }
                            }}
                        >
                            <ListItemText 
                                primary={doc.title}
                                secondary={`Last modified: ${new Date(doc.lastModified).toLocaleString()}`}
                                onClick={() => navigate(`/editor/${doc._id}`)}
                                sx={{ cursor: 'pointer' }}
                            />
                            <Button
                                variant="outlined"
                                size="small"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleShare(doc);
                                }}
                                sx={{ ml: 2 }}
                            >
                                Share
                            </Button>
                        </ListItem>
                    ))}
                </List>
            </Paper>

            {selectedDoc && (
                <ShareDialog
                    open={shareDialogOpen}
                    onClose={() => setShareDialogOpen(false)}
                    document={selectedDoc}
                    onShare={handleShareComplete}
                    collaborators={selectedDoc.collaborators}
                />
            )}
        </Container>
    );
}

export default Documents;