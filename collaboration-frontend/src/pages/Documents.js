// src/pages/Documents.js
import React, { useEffect, useState } from 'react';
import { 
    Container, 
    Paper, 
    Typography, 
    Button, 
    List, 
    ListItem, 
    ListItemText,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    IconButton,
    Menu,
    MenuItem,
    Alert,
} from '@mui/material';
import { MoreVert as MoreVertIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import ShareDialog from '../components/ShareDialog';


function Documents() {
    const [documents, setDocuments] = useState([]);
    const [error, setError] = useState('');
    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [newDocumentTitle, setNewDocumentTitle] = useState('');
    const [selectedDoc, setSelectedDoc] = useState(null);
    const [shareDialogOpen, setShareDialogOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [editingDoc, setEditingDoc] = useState(null);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [editTitle, setEditTitle] = useState('');
    const navigate = useNavigate();
    const [currentUserId, setCurrentUserId] = useState(localStorage.getItem('userId'));


    const loadDocuments = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:3002/api/documents', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            console.log('Documents loaded:', data); // Add this line
            setDocuments(data);
        } catch (error) {
            console.error('Error loading documents:', error);
            setError('Failed to load documents');
        }
    };

    useEffect(() => {
        loadDocuments();
    }, []);

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
                    title: newDocumentTitle,
                    content: ''
                })
            });
            setCreateDialogOpen(false);
            setNewDocumentTitle('');
            loadDocuments();
        } catch (error) {
            console.error('Error creating document:', error);
            setError('Failed to create document');
        }
    };

    const handleEditDocument = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:3002/api/documents/${editingDoc._id}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    title: editTitle
                })
            });

            if (!response.ok) {
                throw new Error('Failed to update document title');
            }

            setEditDialogOpen(false);
            setEditingDoc(null);
            setEditTitle('');
            loadDocuments();
        } catch (error) {
            console.error('Error updating document:', error);
            setError('Failed to update document title');
        }
    };

    const handleDeleteDocument = async (docId) => {
        if (window.confirm('Are you sure you want to delete this document? This action cannot be undone.')) {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`http://localhost:3002/api/documents/${docId}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to delete document');
                }

                loadDocuments();
            } catch (error) {
                console.error('Error deleting document:', error);
                setError('Failed to delete document');
            }
        }
    };

    const handleShare = (doc) => {
        setSelectedDoc(doc);
        setShareDialogOpen(true);
        setAnchorEl(null);
    };

    const handleShareComplete = async () => {
        await loadDocuments();
        setShareDialogOpen(false);
    };

    const handleMenuOpen = (event, doc) => {
        setAnchorEl(event.currentTarget);
        setSelectedDoc(doc);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleEditClick = (doc) => {
        setEditingDoc(doc);
        setEditTitle(doc.title);
        setEditDialogOpen(true);
        handleMenuClose();
    };

    

    // const currentUserId = localStorage.getItem('userId'); // You'll need to store this when logging in

    return (
        <Container maxWidth="md">
            <Paper sx={{ p: 3, mt: 8 }}>
                <Typography variant="h5" gutterBottom>My Documents</Typography>
                {error && (
                    <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
                        {error}
                    </Alert>
                )}
                <Button 
                    variant="contained" 
                    onClick={() => setCreateDialogOpen(true)} 
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
                            <IconButton onClick={(e) => handleMenuOpen(e, doc)}>
                                <MoreVertIcon />
                            </IconButton>
                        </ListItem>
                    ))}
                </List>
            </Paper>

            {/* Create Document Dialog */}
            <Dialog open={createDialogOpen} onClose={() => setCreateDialogOpen(false)}>
                <DialogTitle>Create New Document</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Document Title"
                        fullWidth
                        value={newDocumentTitle}
                        onChange={(e) => setNewDocumentTitle(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setCreateDialogOpen(false)}>Cancel</Button>
                    <Button 
                        onClick={createNewDocument}
                        disabled={!newDocumentTitle.trim()}
                    >
                        Create
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Edit Document Dialog */}
            <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
                <DialogTitle>Edit Document Title</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Document Title"
                        fullWidth
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
                    <Button 
                        onClick={handleEditDocument}
                        disabled={!editTitle.trim()}
                    >
                        Save
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Document Menu */}
            <Menu
    anchorEl={anchorEl}
    open={Boolean(anchorEl)}
    onClose={handleMenuClose}
>
    <MenuItem onClick={() => handleShare(selectedDoc)}>Share</MenuItem>
    {selectedDoc && selectedDoc.owner === currentUserId && (
        <>
            <MenuItem onClick={() => handleEditClick(selectedDoc)}>
                Rename
            </MenuItem>
            <MenuItem 
                onClick={() => {
                    handleMenuClose();
                    handleDeleteDocument(selectedDoc._id);
                }}
                sx={{ color: 'error.main' }}
            >
                Delete
            </MenuItem>
        </>
    )}
</Menu>

            {/* Share Dialog */}
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