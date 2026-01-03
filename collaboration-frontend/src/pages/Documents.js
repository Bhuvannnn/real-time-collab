// src/pages/Documents.js
import React, { useEffect, useState } from 'react';
import config from '../config';
import { 
    Container, 
    Paper, 
    Typography, 
    Button, 
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    IconButton,
    Menu,
    MenuItem,
    Alert,
    AppBar,
    Toolbar,
    Grid,
    Card,
    CardContent,
    CardActionArea,
    Box,
    Chip,
} from '@mui/material';
import { 
    MoreVert as MoreVertIcon,
    Description as DescriptionIcon,
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Share as ShareIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import ShareDialog from '../components/ShareDialog';
import { Logout as LogOutIcon } from '@mui/icons-material';


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
    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };


    const loadDocuments = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${config.DOCUMENT_URL}/api/documents`, {
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
            await fetch(`${config.DOCUMENT_URL}/api/documents`, {
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
            const response = await fetch(`${config.DOCUMENT_URL}/api/documents${editingDoc._id}`, {
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
                const response = await fetch(`${config.DOCUMENT_URL}/api/documents/${docId}`, {
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
        <>
        <AppBar position="fixed" color="default" elevation={0}>
            <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 2, sm: 3 } }}>
                <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
                    Collaborative Editor
                </Typography>
                <Button
                    variant="outlined"
                    startIcon={<LogOutIcon />}
                    onClick={handleLogout}
                    sx={{ borderRadius: 2 }}
                >
                    Logout
                </Button>
            </Toolbar>
        </AppBar>
        
        <Container maxWidth="lg" sx={{ mt: 10, mb: 4, px: { xs: 2, sm: 3 } }}>
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                <Typography variant="h4" sx={{ fontWeight: 600, color: 'text.primary' }}>
                    My Documents
                </Typography>
                <Button 
                    variant="contained" 
                    startIcon={<AddIcon />}
                    onClick={() => setCreateDialogOpen(true)}
                    size="large"
                >
                    New Document
                </Button>
            </Box>
            
            {error && (
                <Alert 
                    severity="error" 
                    sx={{ mb: 3, borderRadius: 2 }} 
                    onClose={() => setError('')}
                >
                    {error}
                </Alert>
            )}
            
            {documents.length === 0 ? (
                <Paper 
                    elevation={0}
                    sx={{ 
                        p: 6, 
                        textAlign: 'center',
                        bgcolor: 'background.paper',
                        borderRadius: 3
                    }}
                >
                    <DescriptionIcon sx={{ fontSize: 64, color: 'primary.light', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                        No documents yet
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                        Create your first document to get started
                    </Typography>
                    <Button 
                        variant="contained" 
                        startIcon={<AddIcon />}
                        onClick={() => setCreateDialogOpen(true)}
                    >
                        Create Document
                    </Button>
                </Paper>
            ) : (
                <Grid container spacing={3}>
                    {documents.map((doc) => (
                        <Grid item xs={12} sm={6} md={4} key={doc._id}>
                            <Card 
                                elevation={0}
                                sx={{ 
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    border: '1px solid',
                                    borderColor: 'divider',
                                    transition: 'all 0.2s ease-in-out',
                                    '&:hover': {
                                        borderColor: 'primary.light',
                                        boxShadow: 3
                                    }
                                }}
                            >
                                <CardActionArea
                                    onClick={() => navigate(`/editor/${doc._id}`)}
                                    sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}
                                >
                                    <CardContent sx={{ width: '100%', pb: 2 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1.5 }}>
                                            <DescriptionIcon 
                                                sx={{ 
                                                    fontSize: 32, 
                                                    color: 'primary.main', 
                                                    mr: 1.5,
                                                    mt: 0.5
                                                }} 
                                            />
                                            <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                                                <Typography 
                                                    variant="h6" 
                                                    sx={{ 
                                                        fontWeight: 600,
                                                        mb: 0.5,
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                        display: '-webkit-box',
                                                        WebkitLineClamp: 2,
                                                        WebkitBoxOrient: 'vertical'
                                                    }}
                                                >
                                                    {doc.title}
                                                </Typography>
                                                {doc.owner === currentUserId && (
                                                    <Chip 
                                                        label="Owner" 
                                                        size="small" 
                                                        sx={{ 
                                                            bgcolor: 'primary.light',
                                                            color: 'primary.dark',
                                                            fontSize: '0.7rem',
                                                            height: 20
                                                        }} 
                                                    />
                                                )}
                                            </Box>
                                        </Box>
                                        <Typography 
                                            variant="caption" 
                                            color="text.secondary"
                                            sx={{ display: 'block' }}
                                        >
                                            Modified {new Date(doc.lastModified).toLocaleDateString('en-US', { 
                                                month: 'short', 
                                                day: 'numeric',
                                                year: 'numeric'
                                            })}
                                        </Typography>
                                    </CardContent>
                                </CardActionArea>
                                <Box sx={{ p: 1, display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid', borderColor: 'divider' }}>
                                    <IconButton 
                                        size="small" 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleMenuOpen(e, doc);
                                        }}
                                        sx={{ color: 'text.secondary' }}
                                    >
                                        <MoreVertIcon fontSize="small" />
                                    </IconButton>
                                </Box>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}
        </Container>

            {/* Create Document Dialog */}
            <Dialog 
                open={createDialogOpen} 
                onClose={() => setCreateDialogOpen(false)}
                PaperProps={{
                    sx: { borderRadius: 3 }
                }}
            >
                <DialogTitle sx={{ pb: 1, fontWeight: 600 }}>Create New Document</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Document Title"
                        fullWidth
                        value={newDocumentTitle}
                        onChange={(e) => setNewDocumentTitle(e.target.value)}
                        sx={{ mt: 2 }}
                    />
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2.5 }}>
                    <Button 
                        onClick={() => setCreateDialogOpen(false)}
                        sx={{ borderRadius: 2 }}
                    >
                        Cancel
                    </Button>
                    <Button 
                        onClick={createNewDocument}
                        disabled={!newDocumentTitle.trim()}
                        variant="contained"
                        sx={{ borderRadius: 2 }}
                    >
                        Create
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Edit Document Dialog */}
            <Dialog 
                open={editDialogOpen} 
                onClose={() => setEditDialogOpen(false)}
                PaperProps={{
                    sx: { borderRadius: 3 }
                }}
            >
                <DialogTitle sx={{ pb: 1, fontWeight: 600 }}>Rename Document</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Document Title"
                        fullWidth
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        sx={{ mt: 2 }}
                    />
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2.5 }}>
                    <Button 
                        onClick={() => setEditDialogOpen(false)}
                        sx={{ borderRadius: 2 }}
                    >
                        Cancel
                    </Button>
                    <Button 
                        onClick={handleEditDocument}
                        disabled={!editTitle.trim()}
                        variant="contained"
                        sx={{ borderRadius: 2 }}
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
                PaperProps={{
                    sx: {
                        borderRadius: 2,
                        minWidth: 180,
                        boxShadow: 3
                    }
                }}
            >
                <MenuItem 
                    onClick={() => {
                        handleMenuClose();
                        handleShare(selectedDoc);
                    }}
                    sx={{ py: 1.5 }}
                >
                    <ShareIcon sx={{ mr: 1.5, fontSize: 20 }} />
                    Share
                </MenuItem>
                {selectedDoc && selectedDoc.owner === currentUserId && (
                    <>
                        <MenuItem 
                            onClick={() => {
                                handleMenuClose();
                                handleEditClick(selectedDoc);
                            }}
                            sx={{ py: 1.5 }}
                        >
                            <EditIcon sx={{ mr: 1.5, fontSize: 20 }} />
                            Rename
                        </MenuItem>
                        <MenuItem 
                            onClick={() => {
                                handleMenuClose();
                                handleDeleteDocument(selectedDoc._id);
                            }}
                            sx={{ 
                                color: 'error.main',
                                py: 1.5
                            }}
                        >
                            <DeleteIcon sx={{ mr: 1.5, fontSize: 20 }} />
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
        </>
    );
}

export default Documents;